const { Router } = require("express");
const Calendar = require("../models/calendar");
const router = Router();


router.post('/add-event', async (req, res) => {
  const { userId, event, date } = req.body;

  if (!userId || !event || !date) {
    return res.status(400).json({ error: 'userId, event, and date are required' });
  }

  try {
    
    let userCalendar = await Calendar.findOne({ userId });

    if (!userCalendar) {
     
      userCalendar = new Calendar({
        userId,
        events: [{ event, date }]
      });
    } else {
      
      userCalendar.events.push({ event, date });
    }

    
    const savedCalendar= await userCalendar.save();
    console.log(savedCalendar);
    const lastCalendar = savedCalendar.events[savedCalendar.events.length - 1];
    
    res.status(200).json({ eventId: lastCalendar._id });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
     
    const userId = req.params.id;
      
      const userCalendar = await Calendar.findOne({ userId });

   
      if (!userCalendar) {
          return res.status(404).json({ message: "event not found" });
      }


      const events = userCalendar.events;
   
   console.log(events);

      return res.json(events);
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
      return res.status(404).json({ message: 'Calendar document not found for this user' });
    }

    
    const eventIndex = userCalendar.events.findIndex(event => event._id.toString() === eventId);


    if (eventIndex === -1) {
      return res.status(404).json({ message: 'event not found' });
    }

    
    userCalendar.events.splice(eventIndex, 1);

   
    const events = await userCalendar.save();

    return res.status(200).json(events);
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.patch('/:userId/:eventId', async (req, res) => {
  const { userId, eventId } = req.params;

  try {
   
    const calendar = await Calendar.findOneAndUpdate(
      { userId: userId, 'events._id': eventId }, 
      { $set: { 'events.$.completed': true } }, 
      { new: true } 
    );

    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }
     const events = calendar.events;
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating event' });
  }
});


module.exports=router;