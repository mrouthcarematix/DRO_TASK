import { configureStore } from '@reduxjs/toolkit';
import surveyReducer from '../features/survey/surveySlice';

const store = configureStore({
  reducer: {
    survey: surveyReducer,
  },
});

export default store;
