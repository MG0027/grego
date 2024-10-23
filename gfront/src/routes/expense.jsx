
import { useDispatch, useSelector } from 'react-redux';
import Fetchexpense from '../components/fetchexpense';
import Fetchincome from '../components/fetchincome';
import Sidebar from '../components/sidebar';
import styles from './expense.module.css'
import { useMemo, useRef } from 'react';
import axios from 'axios';
import { expenseActions } from '../store/expenseslice';
import { incomeActions } from '../store/amountslice';




function Expenses(){




  const { userId } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const incomeAmountRef = useRef();
  const expenseAmountRef = useRef();
  const expensedescRef = useRef();
  const incomedescRef = useRef();

  
  const expenses = useSelector(state => state.expense);
  console.log(expenses)
  const incomes = useSelector(state=> state.income);
 console.log(incomes);
  const hidenExpense = expenses.filter((expense) => expense.hide === true);
  const hidenIncome = incomes.filter((income)=>income.hide ===true);


  const totals = useMemo(() => {
    const totalIncome = incomes
      .filter(income => !income.hide)
      .reduce((sum, income) => sum + income.amount, 0);
    
    const totalExpense = expenses
      .filter(expense => !expense.hide)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const balance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, balance };
  }, [incomes, expenses]);

 

  const handleAddExpense = async () => {
    const expenseAmount = expenseAmountRef.current.value;
    const expensedesc = expensedescRef.current.value;
   
    
    if (!expenseAmount && !expensedesc ) {
      alert('Please fill out all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:2000/expense/add-expense', {
        userId: userId,
        amount: Number(expenseAmount),
        description: expensedesc,
      });
   
      if (response.status === 200) {
        const { expenseId } = response.data;
        console.log(response.data)
        dispatch(expenseActions.addexpense({
          _id: expenseId,
          amount: Number(expenseAmount),
          description: expensedesc,
          hide: false,
        }));

        expenseAmountRef.current.value = '';
        expensedescRef.current.value='';
        
      }
    } catch (error) {
      console.error("Error adding exp:", error);
    }
  };

  const removeExpTask = async (expenseId) => {
    console.log(expenseId)
    try {
      await axios.delete(`http://localhost:2000/expense/${userId}/${expenseId}`, {
        data: {
          userId: userId,
          expenseId,
        }
      });
      
      dispatch(expenseActions.removeexpense({
        expenseId
      }));
    } catch (error) {
      console.error('Error removing exp', error);
    }
  };


  const hideExpense = async (expenseId) => {
    try {
      const response = await axios.patch(`http://localhost:2000/expense/${userId}/${expenseId}`);
      const updatedExpense = response.data;
      dispatch(expenseActions.setexpense(updatedExpense));
    } catch (error) {
      console.error('Error updating expense', error);
    }
  };
  
  const hideIncome = async (incomeId) => {
    try {
      const response = await axios.patch(`http://localhost:2000/income/${userId}/${incomeId}`, 
        
      );
      const updatedIncome = response.data;
      dispatch(incomeActions.setincome(updatedIncome));
    } catch (error) {
      console.error('Error updating income', error);
    }
  };

  const handleAddIncome = async () => {
    const incomeAmount = incomeAmountRef.current.value;
    const incomedesc = incomedescRef.current.value;
   
    
    if (!incomeAmount && !incomedesc ) {
      alert('Please fill out all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:2000/income/add-income', {
        userId: userId,
        amount: Number(incomeAmount),
        description: incomedesc,
      });
   
      if (response.status === 200) {
        const { incomeId } = response.data;
        console.log(response.data);
        dispatch(incomeActions.addincome({
          _id: incomeId,
          amount: Number(incomeAmount),
          description: incomedesc,
          hide: false,
        }));

        incomeAmountRef.current.value = '';
        incomedescRef.current.value='';
        
      }
    } catch (error) {
      console.error("Error adding exp:", error);
    }
  };

  const removeIncTask = async (incomeId) => {
    console.log(incomeId);
    try {
      await axios.delete(`http://localhost:2000/income/${userId}/${incomeId}`, {
        data: {
          userId: userId,
         incomeId,
        }
      });
      
      dispatch(incomeActions.removeincome({
       incomeId
      }));
    } catch (error) {
      console.error('Error removing inc', error);
    }
  };

 

  return(<div className={styles.expense}>
    
    <Sidebar />
    <main className={styles.mainContent}>
        <h1><img src='/images/paper-money-cash-vector-illustration-Graphics-6296733-1-removebg-preview.png'></img>Expense Tracker</h1>
           {/* Summary Section */}
           <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <h3>Total Income</h3>
            <p className={styles.income}>₹{totals.totalIncome}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Total Expenses</h3>
            <p className={styles.income}>₹{totals.totalExpense}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Balance</h3>
            <p className={totals.balance >= 0 ? styles.income : styles.income}>
              ₹{totals.balance}
            </p>
          </div>
        </div>

        <div className={styles.screen}>
        <div className={styles.income}>
          <h3> <i className="bi bi-arrow-up" style={{color:'#39FF14', backgroundColor:'transparent', }}></i>Income</h3>
          <div className={styles.inputfield}>
            <div className={styles.two}>
          <input type='number' placeholder='' className={styles.one} ref={incomeAmountRef}></input>
          <label>Amount(₹)</label>
          </div>
          
          <div className={styles.three}>
          <input type='text' placeholder='' ref={incomedescRef}></input>
          <label>Description</label>
          </div>
          <button onClick={handleAddIncome} style={{backgroundColor:'transparent'}}><i className="bi bi-plus-circle" style={{color:'whitesmoke'}}></i></button>
          </div>
          {incomes.length > 0 ? (
             incomes.map((income, index) => {
                
               
                return (
                  <div key={index}  className={`${styles.transactionItem} ${income.hide ? styles.hiddenTransaction : ''}`}>
                    <div className={styles.taskInfo}>
                      <p className={styles.taskName}>{income.amount}</p>
                      <p className={styles.taskName}>{income.description}</p>

                      {/* <div className={styles.taskDateTime}>
                        <span>Due date: {formatteddate}</span>
                        
                      </div> */}
                    </div>
                    <div style={{display:'flex', backgroundColor:'transparent', justifyContent:"right", alignItems:'center'}}>
                    <button 
        onClick={() => hideIncome(income._id)} 
        className={styles.hideButton}
        title={income.hide ? "Hidden from total" : "Hide from total"}
      >
        <i className="bi bi-eye-slash"></i>
      </button>
                    <button onClick={() => removeIncTask(income._id)} className={styles.deleteButton}>
                     <span className={styles.deleteIcon}>×</span>
                    </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{backgroundColor:'transparent', textAlign:'center'}}>No Income available. Add a new Income.</p>
            )}
       
        </div>
        <div className={styles.expenses}>
          <h3> <i className="bi bi-arrow-down" style={{backgroundColor:'transparent', color:'red'}}></i>Expenses</h3>
          <div className={styles.inputfield2}>
          <div className={styles.two} >
          <input type='number' placeholder='' className={styles.one} ref={expenseAmountRef}></input>
          <label>Amount(₹)</label>
          </div>
          <div className={styles.three}>
          <input type='text' placeholder='' ref={expensedescRef}></input>
          <label>Description</label>
          </div>
          <button onClick={handleAddExpense} style={{backgroundColor:'transparent'}}><i className="bi bi-plus-circle" style={{color:'whitesmoke'}}></i></button>
          </div>
          {expenses.length > 0 ? (
            expenses.map((expense, index) => {
                
               
                return (
                  <div key={index} className={`${styles.transactionItem} ${expense.hide ? styles.hiddenTransaction : ''}`}>
                    <div className={styles.taskInfo}>
                      <p className={styles.taskName}>{expense.amount}</p>
                      <p className={styles.taskName}>{expense.description}</p>

                      {/* <div className={styles.taskDateTime}>
                        <span>Due date: {formatteddate}</span>
                        
                      </div> */}
                    </div>
                    <div style={{display:'flex', backgroundColor:'transparent', justifyContent:"right", alignItems:'center'}}>
                    <button 
        onClick={() => hideExpense(expense._id)} 
        className={styles.hideButton}
        title={expense.hide ? "Hidden from total" : "Hide from total"}
      >
        <i className="bi bi-eye-slash"></i>
      </button>
                    <button onClick={() => removeExpTask(expense._id)} className={styles.deleteButton}>
                     <span className={styles.deleteIcon}>×</span>
                    </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{backgroundColor:'transparent', textAlign:'center'}}>No Expense available. Add a new Expense.</p>
            )}
        </div>
        
    </div>
        
      {/* Add more content here */}
    </main>
  </div>)
}

export default Expenses;