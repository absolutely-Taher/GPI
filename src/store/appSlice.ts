import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../types';

const initialState: AppState = {
  isLocked: false,
  isOnline: true,
  selectedCategory: 'beauty', // Default category for the Specific Category screen
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLocked: (state, action: PayloadAction<boolean>) => {
      state.isLocked = action.payload;
    },
    setOnline: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setLocked, setOnline, setSelectedCategory } = appSlice.actions;
export default appSlice.reducer;

