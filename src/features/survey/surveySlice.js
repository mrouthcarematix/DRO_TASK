import { createSlice } from '@reduxjs/toolkit';
import { fetchSurvey, saveSurveyResponse } from './surveyThunk';

const surveySlice = createSlice({
  name: 'survey',
  initialState: {
    survey: null,
    loading: false,
    error: null,
    currentPage: 0,
    answers: {}, 
    submissionStatus: null,
  },
  reducers: {
    nextPage: (state) => {
      if (state.survey && state.survey.pages && state.currentPage < state.survey.pages.length - 1) {
        state.currentPage += 1;
      }
    },
    prevPage: (state) => {
      if (state.currentPage > 0) {
        state.currentPage -= 1;
      }
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setAnswer: (state, action) => {
      const { pageIndex, answer } = action.payload;
      state.answers[pageIndex] = answer; 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurvey.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSurvey.fulfilled, (state, action) => {
        state.loading = false;
        state.survey = action.payload;
      })
      .addCase(fetchSurvey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveSurveyResponse.pending, (state) => {
        state.submissionStatus = 'pending';
      })
      .addCase(saveSurveyResponse.fulfilled, (state) => {
        state.submissionStatus = 'fulfilled';
      })
      .addCase(saveSurveyResponse.rejected, (state, action) => {
        state.submissionStatus = 'rejected';
        state.error = action.payload;
      });
  },
});

export const { nextPage, prevPage, setCurrentPage, setAnswer } = surveySlice.actions;
export default surveySlice.reducer;
