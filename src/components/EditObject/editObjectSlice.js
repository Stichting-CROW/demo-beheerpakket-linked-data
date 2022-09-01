import { createSlice } from '@reduxjs/toolkit';

// Get persistentState from localStorage
const persistedState = localStorage.getItem('IMBOR_DEMO_APP_reduxState')
  ? JSON.parse(localStorage.getItem('IMBOR_DEMO_APP_reduxState'))
  : {}

const initialState = {
  physicalObjects: persistedState && persistedState.editObject
    ? persistedState.editObject.physicalObjects
    : [],
  attributesForPhysicalObjects: persistedState && persistedState.editObject
    ? persistedState.editObject.attributesForPhysicalObjects
    : [],
};

export const editObjectSlice = createSlice({
  name: 'editObject',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setPhysicalObjects: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.physicalObjects = action.payload;
    },
    setAttributesForPhysicalObject: (state, action) => {
      const {physicalObjectIri, attributes} = action.payload;
      state.attributesForPhysicalObjects[physicalObjectIri] = [];
      state.attributesForPhysicalObjects = {};
    },
    setGeoClasses: (state, action) => {
      state.geoClasses = action.payload;
    }
  }
});

export const {
  setPhysicalObjects,
  setAttributesForPhysicalObject,
  setGeoClasses
} = editObjectSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.editObject.physicalObjects)`
export const selectPhysicalObjects = (state) => state.editObject.physicalObjects;
export const selectGeoClasses = (state) => state.editObject.geoClasses;
export const selectAttributesForPhysicalObjects = (state) => state.editObject.attributesForPhysicalObjects;

export default editObjectSlice.reducer;
