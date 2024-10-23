const { Router } = require("express");

const Income = require("../models/income");
const router = Router();


router.post('/add-income', async (req, res) => {
  const { userId, amount, description } = req.body;

  if (!userId || !amount || !description) {
    return res.status(400).json({ error: 'userId, amt, and descp are required' });
  }

  try {
    
    let userIncome = await Income.findOne({ userId });

    if (!userIncome) {
     
      userIncome = new Income({
        userId,
        incomes: [{ amount, description }]
      });
    } else {
      
      userIncome.incomes.push({ amount, description });
    }

    
    const savedIncome= await userIncome.save();
    
    const lastIncome = savedIncome.incomes[savedIncome.incomes.length - 1];
    
    res.status(200).json({ incomeId: lastIncome._id });
  } catch (error) {
    console.error('Error adding inc:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
     
    const userId = req.params.id;
      
      const userIncome = await Income.findOne({ userId });

   
      if (!userIncome) {
          return res.status(404).json({ message: "inc not found" });
      }


      const incomes = userIncome.incomes;
   
   

      return res.json(incomes);
  } catch (error) {
      console.error('Error fetching inc:', error); 
      return res.status(500).json({
          message: "An error occurred while fetching inc",
          error: error.message,
      });
  }
});

router.delete('/:userId/:incomeId', async (req, res) => {
  const { userId, incomeId } = req.params;

  try {
    
    const userIncome = await Income.findOne({ userId });

    if (!userIncome) {
      return res.status(404).json({ message: 'INC not found for this user' });
    }

    
    const incomeIndex = userIncome.incomes.findIndex(income => income._id.toString() === incomeId);


    if (incomeIndex === -1) {
      return res.status(404).json({ message: 'inc not found' });
    }

    
    userIncome.incomes.splice(incomeIndex, 1);

   
    const incomes = await userIncome.save();

    return res.status(200).json(incomes);
  } catch (error) {
    console.error('Error deleting inc:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.patch('/:userId/:incomeId', async (req, res) => {
  const { userId, incomeId } = req.params;

  try {
    // Find the income first to get its current 'hide' value
    const income = await Income.findOne({ userId: userId, 'incomes._id': incomeId });

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    // Find the specific income to toggle the hide status
    const currentIncome = income.incomes.id(incomeId);
    const newHideStatus = !currentIncome.hide; // Toggle the 'hide' status

    // Update the 'hide' status
    const updatedIncome = await Income.findOneAndUpdate(
      { userId: userId, 'incomes._id': incomeId }, 
      { $set: { 'incomes.$.hide': newHideStatus } }, 
      { new: true }
    );

    const incomes = updatedIncome.incomes;
    res.status(200).json(incomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating income' });
  }
});


module.exports=router;