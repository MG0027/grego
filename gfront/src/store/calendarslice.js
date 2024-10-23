import {createSlice} from "@reduxjs/toolkit";

const calendarSlice = createSlice({
  name: 'event',
  initialState: [],
  reducers: {
    addevent: (state, action) => {
      state.push({
       _id: action.payload._id,
        event: action.payload.event,
        completed: action.payload.completed,
        
        
        date: action.payload.date
      });
    },
      removeevent(state, action) {
       
        return state.filter(item => item._id !== action.payload.eventId);
      },
    
      setevent(state, action) {
        return action.payload; 
      },
    }
  }
);

export const calendarActions = calendarSlice.actions;

export default calendarSlice;