import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setUserSurveySessionId } from './surveySlice';

export const fetchDashboardData = createAsyncThunk(
  'survey/fetchDashboardData',
  async (_, thunkAPI) => {
    try {
    //   const response = await axios.post(
    //     '/api/dashboard/dashboardData',
    //     {
    //       programUserId: 1145,
    //       timezone: 'Asia/Kolkata',
    //       language: 'EN',
    //     },
    //     {
    //       headers: {
    //         'X-DRO-APPVERSION': '1.0',
    //         'X-DRO-TIMEZONE': 'Asia/Kolkata',
    //         'X-DRO-LANGUAGE': 'EN',
    //         'X-DRO-SOURCE': 'IOS',
    //         'X-DRO-TOKEN': '3g1873e8fh377a1',
    //       }
    //     }
    //   );
      const response = await axios.get('/DashBoard.json');
      console.log(response.data,'-------DashBoard-------');
      const { userSurveySessions } = response.data;
      if (userSurveySessions && userSurveySessions.length > 0) {
        const userSurveySessionId = userSurveySessions[0].surveySessionInfo.userSurveySessionId
        ;
        console.log(userSurveySessionId,'-------userSurveySessionIduserSurveySessionId-------');
        thunkAPI.dispatch(setUserSurveySessionId(userSurveySessionId));
        return userSurveySessionId;
      } else {
        throw new Error('No user survey sessions found');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
