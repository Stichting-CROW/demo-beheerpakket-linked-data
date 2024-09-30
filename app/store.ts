"use client"

import { configureStore } from '@reduxjs/toolkit';
import editObjectReducer from './components/EditObject/editObjectSlice';

export const store = configureStore({
  reducer: {
    editObject: editObjectReducer,
  }
});

// Store Redux state into localStorage
store.subscribe(() => {
  const storeState = store.getState();
  const storeStateToSaveInLocalStorage = {
    lastUpdate: Date.now(),
    editObject: storeState.editObject
  }
  if(typeof window !== 'undefined') {
    localStorage.setItem('IMBOR_DEMO_APP_reduxState', JSON.stringify(storeStateToSaveInLocalStorage))
  }
})
