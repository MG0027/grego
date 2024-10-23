import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { incomeActions } from "../store/amountslice";
import API_BASE_URL from "../../config";

function Fetchincome() {
  const { userId } = useSelector(state => state.user); 
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchIncome = async () => {
      try {
      
        const res = await fetch(`${API_BASE_URL}/income/${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch inc");
        }
        const income = await res.json();

        dispatch(incomeActions.setincome(income));
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) {
      
      fetchIncome();
    }
  }, [userId, dispatch]); 

  return null;
}

export default Fetchincome;
