const { Router } = require("express");
const Task = require("../models/task");
const router = Router();


router.post('/add-task', async (req, res) => {
  const { userId, task, duedatetime } = req.body;

  if (!userId || !task || !duedatetime) {
    return res.status(400).json({ error: 'userId, task, and duedatetime are required' });
  }

  try {
    // Find the task document for the user
    let userTask = await Task.findOne({ userId });

    if (!userTask) {
      // If no task document exists for this user, create a new one
      userTask = new Task({
        userId,
        tasks: [{ task, duedatetime }]
      });
    } else {
      // If task document exists, push the new task into the tasks array
      userTask.tasks.push({ task, duedatetime });
    }

    // Save the task document
    const savedTask= await userTask.save();
    console.log(savedTask);
    const lastTask = savedTask.tasks[savedTask.tasks.length - 1];
    
    res.status(200).json({ taskId: lastTask._id });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
     
    const userId = req.params.id;
      
      const userTask = await Task.findOne({ userId });

   
      if (!userTask) {
          return res.status(404).json({ message: "task not found" });
      }


      const tasks = userTask.tasks;
   
   console.log(tasks);

      return res.json(tasks);
  } catch (error) {
      console.error('Error fetching tasks:', error); 
      return res.status(500).json({
          message: "An error occurred while fetching tasks",
          error: error.message,
      });
  }
});

router.delete('/:userId/:taskId', async (req, res) => {
  const { userId, taskId } = req.params;

  try {
    // Find the user task document for the user
    const userTask = await Task.findOne({ userId });

    if (!userTask) {
      return res.status(404).json({ message: 'Task document not found for this user' });
    }

    // Find the index of the task to be deleted
    const taskIndex = userTask.tasks.findIndex(task => task._id.toString() === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Remove the task from the tasks array
    userTask.tasks.splice(taskIndex, 1);

    // Save the updated task document
    const tasks = await userTask.save();

    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.patch('/:userId/:taskId', async (req, res) => {
  const { userId, taskId } = req.params;

  try {
    // Find the task document where the userId matches and the specific taskId in the tasks array
    const task = await Task.findOneAndUpdate(
      { userId: userId, 'tasks._id': taskId }, // Match the userId and the task's _id
      { $set: { 'tasks.$.completed': true } }, // Update the specific task's 'completed' field to true
      { new: true } // Return the updated document
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
     const tasks = task.tasks;
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating task' });
  }
});


module.exports=router;