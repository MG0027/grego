const { Router } = require("express");
const Task = require("../models/task");
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

router.post('/add-task', async (req, res) => {
  const { userId, task, duedatetime } = req.body;

  if (!userId || !task || !duedatetime) {
    return res.status(400).json({ error: 'userId, task, and duedatetime are required' });
  }

  try {
    let userTask = await Task.findOne({ userId });

    if (!userTask) {
      userTask = new Task({
        userId,
        tasks: [{ task, duedatetime }]
      });
    } else {
      userTask.tasks.push({ task, duedatetime });
    }

    const savedTask = await userTask.save();
    const lastTask = savedTask.tasks[savedTask.tasks.length - 1];
    
    // Invalidate user-specific cache instead of general 'tasks' key
    const cacheKey = `tasks_${userId}`;
    await client.del(cacheKey);

    res.status(200).json({ taskId: lastTask._id });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const cacheKey = `tasks_${userId}`;
    
    try {
      const cachedTasks = await getAsync(cacheKey);
      
      if (cachedTasks) {
        console.log('Cache hit');
        return res.json(JSON.parse(cachedTasks));
      }

      const userTask = await Task.findOne({ userId });
      if (!userTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      const tasks = userTask.tasks;
      await client.setex(cacheKey, 3600, JSON.stringify(tasks));

      console.log('Cache miss');
      return res.json(tasks);
    } catch (redisError) {
      // Fallback to database if Redis fails
      console.error('Redis error, falling back to database:', redisError);
      const userTask = await Task.findOne({ userId });
      if (!userTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.json(userTask.tasks);
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
});

router.delete('/:userId/:taskId', async (req, res) => {
  const { userId, taskId } = req.params;

  try {
    const userTask = await Task.findOne({ userId });

    if (!userTask) {
      return res.status(404).json({ message: 'Task document not found for this user' });
    }

    const taskIndex = userTask.tasks.findIndex(task => task._id.toString() === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    userTask.tasks.splice(taskIndex, 1);
    const tasks = await userTask.save();

    // Invalidate user-specific cache
    const cacheKey = `tasks_${userId}`;
    await client.del(cacheKey);

    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.patch('/:userId/:taskId', async (req, res) => {
  const { userId, taskId } = req.params;

  try {
    const task = await Task.findOneAndUpdate(
      { userId: userId, 'tasks._id': taskId },
      { $set: { 'tasks.$.completed': true } },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Invalidate user-specific cache
    const cacheKey = `tasks_${userId}`;
    await client.del(cacheKey);

    res.status(200).json(task.tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating task' });
  }
});

module.exports = router;