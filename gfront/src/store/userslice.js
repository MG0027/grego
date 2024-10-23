import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  name: null,
  
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
     
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.userId = null;
     
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;