import {createSlice} from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: 'task',
  initialState: [],
  reducers: {
    addtask: (state, action) => {
      state.push({
       taskId: action.payload._id,
        task: action.payload.task,
        completed: action.payload.completed,
        
        
        duedatetime: action.payload.duedatetime
      });
    },
      removetask(state, action) {
       
        return state.filter(item => item._id !== action.payload.taskId);
      },
    
      settask(state, action) {
        return action.payload; 
      },
    }
  }
);

export const taskActions = taskSlice.actions;

export default taskSlice;