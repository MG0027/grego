import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { expenseActions } from "../store/expenseslice";
import API_BASE_URL from "../../config";


function Fetchexpense() {
  const { userId } = useSelector(state => state.user); 
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchExpense = async () => {
      try {
      
        const res = await fetch(`${API_BASE_URL}/expense/${userId}`);
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
