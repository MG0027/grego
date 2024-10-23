import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { taskActions } from "../store/taskslice";

function Fetchtask() {
  const { userId } = useSelector(state => state.user); 
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchTask = async () => {
      try {
      
        const res = await fetch(`http://localhost:2000/task/${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch task");
        }
        const task = await res.json();

        dispatch(taskActions.settask(task));
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) {
      
      fetchTask();
    }
  }, [userId, dispatch]); 

  return null;
}

export default Fetchtask;
