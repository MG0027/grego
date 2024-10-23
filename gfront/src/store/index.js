import {configureStore} from "@reduxjs/toolkit";

import userReducer from './userslice';
import taskSlice from "./taskslice";
import calendarSlice from "./calendarslice";

import expenseSlice from "./expenseslice";
import incomeSlice from "./amountslice";

const gregoStore = configureStore({
  reducer:{
    
    user: userReducer,
    task: taskSlice.reducer,
    event: calendarSlice.reducer,
    expense: expenseSlice.reducer,
    income: incomeSlice.reducer,

  }
});

export default gregoStore;