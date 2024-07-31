import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setCurrentPage } from './surveySlice';

export const fetchSurvey = createAsyncThunk(
  'survey/fetchSurvey',
  async (_, thunkAPI) => {
    try {
      const response = await axios.post(
        'https://octopus.carematix.com/peapp/user/survey/getSurvey',
        {
          programUserId: 1145,
          userSurveySessionId: 2683,
          timezone: process.env.REACT_APP_TIMEZONE,
          language: process.env.REACT_APP_LANGUAGE
        },
        {
          headers: {
            'X-DRO-TOKEN': '3g1873e8fh377a1',
            'X-DRO-SOURCE': 'IOS',
            'Content-Type': 'application/json',
            'X-DRO-TIMEZONE': 'Asia/Kolkata',
            'X-DRO-LANGUAGE': 'EN',
          }
        }
      );
      //return response.data.survey;
      const { survey, userSurveySession } = response.data;
      if (userSurveySession) {
        const userSurveySessionDetail = userSurveySession.userSurveySessionDetail;
        if (userSurveySessionDetail) {
          const { progressStatus, lastAnswerPageId } = userSurveySessionDetail;  
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

// export const fetchSurvey = createAsyncThunk(
//   'survey/fetchSurvey',
//   async (_, thunkAPI) => {
//     try {
//       const response = await axios.get('/Survey.json');
//       const { survey, userSurveySession } = response.data;
//       if (userSurveySession) {
//         const userSurveySessionDetail = userSurveySession.userSurveySessionDetail;
//         if (userSurveySessionDetail) {
//           const { progressStatus, lastAnswerPageId } = userSurveySessionDetail;  
//           if (progressStatus === 'NOT_STARTED') {
//             thunkAPI.dispatch(setCurrentPage(0)); 
//           } else if (progressStatus === 'EXPIRED' || progressStatus === 'STARTED') {
//             thunkAPI.dispatch(setCurrentPage(lastAnswerPageId));
//           } else if (progressStatus === 'COMPLETED') {
//             thunkAPI.dispatch(setCurrentPage(-1)); 
//           }
//         } else {
//           console.warn('UserSurveySessionDetail is undefined, starting from page 0');
//           thunkAPI.dispatch(setCurrentPage(0));
//         }
//       } else {
//         console.warn('UserSurveySession is undefined, starting from page 0');
//         thunkAPI.dispatch(setCurrentPage(0));
//       }
      
//       return survey;
//     } catch (error) {
//       console.error('Error fetching survey:', error);
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );


export const saveSurveyResponse = createAsyncThunk(
  'survey/saveSurveyResponse',
  async (surveyData, thunkAPI) => {
    try {
      const response = await axios.post(
        'https://octopus.carematix.com/peapp/user/survey/updateSurveyResponse',
        surveyData,
        {
          headers: {
            'X-DRO-TOKEN': '3g1873e8fh377a1',
            'X-DRO-SOURCE': 'IOS',
            'Content-Type': 'application/json',
            'X-DRO-TIMEZONE': 'Asia/Kolkata',
            'X-DRO-LANGUAGE': 'EN',
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

