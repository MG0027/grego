const { Router } = require("express");

const Expense = require("../models/expense");
const router = Router();


router.post('/add-expense', async (req, res) => {
  const { userId, amount, description } = req.body;

  if (!userId || !amount || !description) {
    return res.status(400).json({ error: 'userId, amount, and daiscription are required' });
  }

  try {
    
    let userExpense = await Expense.findOne({ userId });

    if (!userExpense) {
     
     userExpense = new Expense({
        userId,
        expenses: [{ amount, description}]
      });
    } else {
      
      userExpense.expenses.push({ amount, description });
    }

    
    const savedExpense = await userExpense.save();
   
    const lastExpense = savedExpense.expenses[savedExpense.expenses.length - 1];
    
    res.status(200).json({ expenseId: lastExpense._id });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
     
    const userId = req.params.id;
      
      const userExpense = await Expense.findOne({ userId });

   
      if (!userExpense) {
          return res.status(404).json({ message: "event not found" });
      }


      const expenses = userExpense.expenses;
   
   

      return res.json(expenses);
  } catch (error) {
      console.error('Error fetching expenses:', error); 
      return res.status(500).json({
          message: "An error occurred while fetching expenses",
          error: error.message,
      });
  }
});

router.delete('/:userId/:expenseId', async (req, res) => {
  const { userId, expenseId } = req.params;

  try {
    
    const userExpense = await Expense.findOne({ userId });

    if (!userExpense) {
      return res.status(404).json({ message: 'Expense not found for this user' });
    }

    
    const expenseIndex = userExpense.expenses.findIndex(expense => expense._id.toString() === expenseId);


    if (expenseIndex === -1) {
      return res.status(404).json({ message: 'expense not found' });
    }

    
    userExpense.expenses.splice(expenseIndex, 1);

   
    const expenses = await userExpense.save();

    return res.status(200).json(expenses);
  } catch (error) {
    console.error('Error deleting exp:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.patch('/:userId/:expenseId', async (req, res) => {
  const { userId, expenseId } = req.params;

  try {
    // Find the income first to get its current 'hide' value
    const expense = await Expense.findOne({ userId: userId, 'expenses._id': expenseId });

    if (!expense) {
      return res.status(404).json({ message: 'Income not found' });
    }

    // Find the specific income to toggle the hide status
    const currentExpense = expense.expenses.id(expenseId);
    const newHideStatus = !currentExpense.hide; // Toggle the 'hide' status

    // Update the 'hide' status
    const updatedExpense = await Expense.findOneAndUpdate(
      { userId: userId, 'expenses._id': expenseId }, 
      { $set: { 'expenses.$.hide': newHideStatus } }, 
      { new: true }
    );

    const expenses = updatedExpense.expenses;
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating income' });
  }
});


module.exports=router;