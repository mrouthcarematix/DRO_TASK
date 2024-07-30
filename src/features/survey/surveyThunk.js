import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setCurrentPage } from './surveySlice';


// export const fetchSurvey = createAsyncThunk(
//   'survey/fetchSurvey',
//   async (_, thunkAPI) => {
//     try {
//       const response = await axios.post(
//         '/api/getSurvey',
//         {
//           programUserId: 1145,
//           userSurveySessionId: 2642,
//           timezone: process.env.REACT_APP_TIMEZONE,
//           language: process.env.REACT_APP_LANGUAGE
//         },
//         {
//           headers: {
//             'X-DRO-APPVERSION': process.env.REACT_APP_API_VERSION,
//             'X-DRO-TIMEZONE': process.env.REACT_APP_TIMEZONE,
//             'X-DRO-LANGUAGE': process.env.REACT_APP_LANGUAGE,
//             'X-DRO-SOURCE': process.env.REACT_APP_SOURCE,
//             'X-DRO-TOKEN': process.env.REACT_APP_TOKEN
//           }
//         }
//       );
//       return response.data.survey;
//     } catch (error) {
//       console.error('Error fetching survey:', error);
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

export const fetchSurvey = createAsyncThunk(
  'survey/fetchSurvey',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/Survey.json');
      console.log('API Response:', response.data); 
      
      const { survey, userSurveySession } = response.data;
      console.log('Survey:', survey);
      console.log('UserSurveySession:', userSurveySession);
      
      if (userSurveySession) {
        const userSurveySessionDetail = userSurveySession.userSurveySessionDetail;
        console.log('UserSurveySessionDetail:', userSurveySessionDetail);
        
        if (userSurveySessionDetail) {
          const { progressStatus, lastAnswerPageId } = userSurveySessionDetail;
          console.log('ProgressStatus:', progressStatus);
          console.log('LastAnswerPageId:', lastAnswerPageId);
          
          if (progressStatus === 'NOT_STARTED') {
            thunkAPI.dispatch(setCurrentPage(0)); 
          } else if (progressStatus === 'EXPIRED' || progressStatus === 'STARTED') {
            thunkAPI.dispatch(setCurrentPage(lastAnswerPageId));
          } else if (progressStatus === 'COMPLETED') {
            thunkAPI.dispatch(setCurrentPage(-1)); 
          }
        } else {
          console.warn('UserSurveySessionDetail is undefined, starting from page 0');
          thunkAPI.dispatch(setCurrentPage(0));
        }
      } else {
        console.warn('UserSurveySession is undefined, starting from page 0');
        thunkAPI.dispatch(setCurrentPage(0));
      }
      
      return survey;
    } catch (error) {
      console.error('Error fetching survey:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


