import { createSlice } from '@reduxjs/toolkit';
import { fetchSurvey, saveSurveyResponse,fetchDashboardData,fetchSurveySession } from './surveyThunk';

const surveySlice = createSlice({
  name: 'survey',
  initialState: {
    survey: null,
    userSurveySession:null,
    loading: false,
    error: null,
    currentPage: 0,
    answers: {},
    submissionStatus: null,
    userSurveySessionId: null,
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
    },
    setUserSurveySessionId: (state, action) => {
      state.userSurveySessionId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSurveySession.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSurveySession.fulfilled, (state, action) => {
        state.loading = false;
        state.userSurveySession = action.payload;
      })
      .addCase(fetchSurveySession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
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

export const { nextPage, prevPage, setCurrentPage, setAnswer, setUserSurveySessionId } = surveySlice.actions;
export default surveySlice.reducer;
