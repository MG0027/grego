import Sidebar from "../components/sidebar";
import styles from './calendar.module.css'
import { useRef, useState } from 'react';
import API_BASE_URL from '../config';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from "react-redux";
import { calendarActions } from "../store/calendarslice";
import Copy from "../components/calendarcopy";
import axios from "axios";

function CalendarComponent(){
  const [date, setDate] = useState(new Date());
 


  const { userId } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const eventNameRef = useRef();
  
  const events = useSelector(state => state.event);
  console.log(events);
  console.log(events);
  console.log(Array.isArray(events));
  const inCompletedEvent = events.filter((event) => event.completed === false);
  console.log(inCompletedEvent);


  const handleDateChange = (date) => {
    setDate(date);
  };

  console.log(date);

  const handleAddEvent = async () => {
    const eventName = eventNameRef.current.value;
    const formattedDate = date.toISOString();
    
    if (!eventName ) {
      alert('Please fill out all fields');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/calendar/add-event`, {
        userId: userId,
        event: eventName,
        date : formattedDate,
      });
      console.log(response.data);
      if (response.status === 200) {
        const { eventId } = response.data;
        dispatch(calendarActions.addevent({
          _id: eventId,
          event: eventName,
          date: formattedDate,
          completed: false,
        }));

        eventNameRef.current.value = '';
        
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const removeTask = async (eventId) => {
    console.log(eventId)
    try {
      await axios.delete(`${API_BASE_URL}/calendar/${userId}/${eventId}`, {
        data: {
          userId: userId,
          eventId,
        }
      });
      
      dispatch(calendarActions.removeevent({
        eventId
      }));
    } catch (error) {
      console.error('Error removing event', error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formatteddate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { formatteddate, formattedTime };
  };

  const changeStatus = async (eventId) => {
    console.log(eventId);
    try {
      const response = await axios.patch(`${API_BASE_URL}/calendar/${userId}/${eventId}`, {
        completed: true,
      });
      const updatedEvent = response.data;
      dispatch(calendarActions.setevent(updatedEvent));
    } catch (error) {
      console.error('Error updating event', error);
    }
  };
 

  return(<div className={styles.calendar}>
    <Sidebar />
    <main className={styles.mainContent}>
        <h1><img src="/images/3124.png_860-removebg-preview.png"></img> Calendar</h1>
        <div className={styles.calendarscreen}>
      <div className={styles.copy}>
        <div >
      <Copy onDateChange={handleDateChange}   />
      </div>
      <div className={styles.calb}>
        <input
          type="text"
          ref={eventNameRef}
          placeholder="Event Title"
          className={styles.eventinput}
        />
        <button onClick={handleAddEvent} style={{backgroundColor:'#4F7942', color:'whitesmoke',}}>Add Event</button>
      </div>
      </div>
      <div className={styles.eventlist}>
       <h4>Upcoming Events</h4>
       {inCompletedEvent.length > 0 ? (
              inCompletedEvent.map((event, index) => {
                
                const { formatteddate, formattedTime } = formatDateTime(event.date);
                return (
                  <div key={index} className={styles.taskItem}>
                    <div className={styles.taskInfo}>
                      <p className={styles.taskName}>{event.event}</p>
                      <div className={styles.taskDateTime}>
                        <span>Due date: {formatteddate}</span>
                        {/* <span>Due time: {formattedTime}</span> */}
                      </div>
                    </div>
                    <div style={{display:'flex', backgroundColor:'transparent', justifyContent:"right", alignItems:'center'}}>
                    <button onClick={()=>changeStatus(event._id)} className={styles.checkb}> <span className={styles.check}><i className="bi bi-check2" style={{backgroundColor:'whitesmoke', color:'green', border:'none',}}></i></span></button>
                    <button onClick={() => removeTask(event._id)} className={styles.deleteButton}>
                     <span className={styles.deleteIcon}>×</span>
                    </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{backgroundColor:'transparent', textAlign:'center'}}>No Events available. Add a new Event.</p>
            )}
       
      </div>
    </div>
    </main>
  </div>)
}

export default CalendarComponent;