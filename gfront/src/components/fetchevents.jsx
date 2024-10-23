import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calendarActions } from "../store/calendarslice";

function Fetchevent() {
  const { userId } = useSelector(state => state.user); 
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchEvent = async () => {
      try {
      
        const res = await fetch(`http://localhost:2000/calendar/${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch event");
        }
        const event = await res.json();

        dispatch(calendarActions.setevent(event));
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) {
      
      fetchEvent();
    }
  }, [userId, dispatch]); 

  return null;
}

export default Fetchevent;
