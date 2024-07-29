import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchSurvey = createAsyncThunk(
  'survey/fetchSurvey',
  async (_, thunkAPI) => {
    try {
      const response = await axios.post(
        '/api/getSurvey',
        {
          programUserId: 1145,
          userSurveySessionId: 2642,
          timezone: process.env.REACT_APP_TIMEZONE,
          language: process.env.REACT_APP_LANGUAGE
        },
        {
          headers: {
            'X-DRO-APPVERSION': process.env.REACT_APP_API_VERSION,
            'X-DRO-TIMEZONE': process.env.REACT_APP_TIMEZONE,
            'X-DRO-LANGUAGE': process.env.REACT_APP_LANGUAGE,
            'X-DRO-SOURCE': process.env.REACT_APP_SOURCE,
            'X-DRO-TOKEN': process.env.REACT_APP_TOKEN
          }
        }
      );
      return response.data.survey;
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
//       return response.data.survey;
//     } catch (error) {
//       console.error('Error fetching survey:', error);
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );
