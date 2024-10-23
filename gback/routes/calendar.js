const { Router } = require("express");
const Calendar = require("../models/calendar");
const router = Router();
const client = require('../client');

// Promisify Redis client methods for better async/await usage
const getAsync = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      if (err) reject(err);
      resolve(reply);
    });
  });
};

// Validate date format
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

router.post('/add-event', async (req, res) => {
  const { userId, event, date } = req.body;

  if (!userId || !event || !date) {
    return res.status(400).json({ error: 'userId, event, and date are required' });
  }

  if (!isValidDate(date)) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  try {
    let userCalendar = await Calendar.findOne({ userId });

    // Check for duplicate events
    if (userCalendar && userCalendar.events.some(e => 
      e.event === event && new Date(e.date).getTime() === new Date(date).getTime()
    )) {
      return res.status(409).json({ error: 'Event already exists at this date and time' });
    }

    if (!userCalendar) {
      userCalendar = new Calendar({
        userId,
        events: [{ event, date: new Date(date) }]
      });
    } else {
      userCalendar.events.push({ event, date: new Date(date) });
    }

    const savedCalendar = await userCalendar.save();
    const lastCalendar = savedCalendar.events[savedCalendar.events.length - 1];

    // Invalidate cache
    const cacheKey = `events_${userId}`;
    await client.del(cacheKey);
    
    res.status(200).json({ 
      eventId: lastCalendar._id,
      event: lastCalendar.event,
      date: lastCalendar.date
    });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const cacheKey = `events_${userId}`;
    
    try {
      const cachedEvents = await getAsync(cacheKey);
      
      if (cachedEvents) {
        console.log('Cache hit');
        const events = JSON.parse(cachedEvents);
        // Sort events by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        return res.json(events);
      }

      const userCalendar = await Calendar.findOne({ userId });
      if (!userCalendar) {
        return res.status(404).json({ message: "No events found for this user" });
      }

      const events = userCalendar.events;
      // Sort events by date before caching
      events.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Cache for 1 hour
      await client.setex(cacheKey, 3600, JSON.stringify(events));

      console.log('Cache miss');
      return res.json(events);
    } catch (redisError) {
      console.error('Redis error, falling back to database:', redisError);
      const userCalendar = await Calendar.findOne({ userId });
      
      if (!userCalendar) {
        return res.status(404).json({ message: "No events found for this user" });
      }

      const events = userCalendar.events.sort((a, b) => new Date(a.date) - new Date(b.date));
      return res.json(events);
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({
      message: "An error occurred while fetching events",
      error: error.message,
    });
  }
});

router.delete('/:userId/:eventId', async (req, res) => {
  const { userId, eventId } = req.params;

  try {
    const userCalendar = await Calendar.findOne({ userId });

    if (!userCalendar) {
      return res.status(404).json({ message: 'Calendar not found for this user' });
    }

    const eventIndex = userCalendar.events.findIndex(event => event._id.toString() === eventId);

    if (eventIndex === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Store event details before deletion for response
    const deletedEvent = userCalendar.events[eventIndex];
    userCalendar.events.splice(eventIndex, 1);
    await userCalendar.save();

    // Invalidate cache
    const cacheKey = `events_${userId}`;
    await client.del(cacheKey);

    return res.status(200).json({
      message: 'Event deleted successfully',
      deletedEvent
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.patch('/:userId/:eventId', async (req, res) => {
  const { userId, eventId } = req.params;
  const { event, date, completed } = req.body;

  try {
    const updateFields = {};
    if (event) updateFields['events.$.event'] = event;
    if (date) {
      if (!isValidDate(date)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
      updateFields['events.$.date'] = new Date(date);
    }
    if (completed !== undefined) updateFields['events.$.completed'] = completed;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No valid update fields provided' });
    }

    const calendar = await Calendar.findOneAndUpdate(
      { userId: userId, 'events._id': eventId },
      { $set: updateFields },
      { new: true }
    );

    if (!calendar) {
      return res.status(404).json({ message: 'Calendar or event not found' });
    }

    // Invalidate cache
    const cacheKey = `events_${userId}`;
    await client.del(cacheKey);

    // Find the updated event
    const updatedEvent = calendar.events.find(e => e._id.toString() === eventId);
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
});

module.exports = router;