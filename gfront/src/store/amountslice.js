import {createSlice} from "@reduxjs/toolkit";

const incomeSlice = createSlice({
  name: 'income',
  initialState: [],
  reducers: {
    addincome: (state, action) => {
      state.push({
       _id: action.payload._id,
        amount: action.payload.amount,
        hide: action.payload.hide,
        
        
       description: action.payload.description
      });
    },
      removeincome(state, action) {
       
        return state.filter(item => item._id !== action.payload.incomeId);
      },
    
      setincome(state, action) {
        return action.payload; 
      },
    }
  }
);

export const incomeActions = incomeSlice.actions;

export default incomeSlice;