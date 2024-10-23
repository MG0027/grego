import {createSlice} from "@reduxjs/toolkit";

const expenseSlice = createSlice({
  name: 'expense',
  initialState: [],
  reducers: {
    addexpense: (state, action) => {
      state.push({
       _id: action.payload._id,
        amount: action.payload.amount,
        hide: action.payload.hide,
        
        
        description: action.payload.description
      });
    },
      removeexpense(state, action) {
       
        return state.filter(item => item._id !== action.payload.expenseId);
      },
    
      setexpense(state, action) {
        return action.payload; 
      },
    }
  }
);

export const expenseActions = expenseSlice.actions;

export default expenseSlice;