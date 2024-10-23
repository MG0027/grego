import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { expenseActions } from "../store/expenseslice";


function Fetchexpense() {
  const { userId } = useSelector(state => state.user); 
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchExpense = async () => {
      try {
      
        const res = await fetch(`http://localhost:2000/expense/${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch event");
        }
        const expense = await res.json();

        dispatch(expenseActions.setexpense(expense));
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) {
      
      fetchExpense();
    }
  }, [userId, dispatch]); 

  return null;
}

export default Fetchexpense;
