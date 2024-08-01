import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setCurrentPage } from './surveySlice';
import { setUserSurveySessionId } from './surveySlice';


export const fetchSurvey = createAsyncThunk(
  'survey/fetchSurvey',
  async (userSurveySessionId,thunkAPI) => {
    try {
      console.log(userSurveySessionId,'------userSurveySessionId----');
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}peapp/user/survey/getSurvey`,
        {
          programUserId: 1145,
          userSurveySessionId: userSurveySessionId,
          timezone: process.env.REACT_APP_TIMEZONE,
          language: process.env.REACT_APP_LANGUAGE
        },
        {
          headers: {
            'X-DRO-TOKEN': process.env.REACT_APP_TOKEN,
            'X-DRO-SOURCE': process.env.REACT_APP_SOURCE,
            'Content-Type': 'application/json',
            'X-DRO-TIMEZONE': process.env.REACT_APP_TIMEZONE,
            'X-DRO-LANGUAGE': process.env.REACT_APP_LANGUAGE,
          },
        }
      );

      const { survey, userSurveySession } = response.data;
      let count=0;
      if (userSurveySession) {
        const userSurveySessionDetail = userSurveySession.userSurveySessionDetail;
        if (userSurveySessionDetail) {
          if(userSurveySession.userAnswerLogs.length>0) count = userSurveySession.userAnswerLogs.length;
          console.log(count,'----Page count value---');
          const { progressStatus } = userSurveySessionDetail;
          if (progressStatus === 'NOT_STARTED') {
            thunkAPI.dispatch(setCurrentPage(0));
          } else if (progressStatus === 'EXPIRED' || progressStatus === 'STARTED') {
            thunkAPI.dispatch(setCurrentPage(count));
          } else if (progressStatus === 'COMPLETED') {
            thunkAPI.dispatch(setCurrentPage(count));
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

export const fetchDashboardData = createAsyncThunk(
  'survey/fetchDashboardData',

  async ( language , thunkAPI) => {
    try {
      console.log(language,'--language fetchDashboardData---------');
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}peapp/user/dashboardData`,
        {
          programUserId: 1145,
          timezone: process.env.REACT_APP_TIMEZONE,
          language: language?.language|| process.env.REACT_APP_LANGUAGE
        },
        {
          headers: {
            'X-DRO-TOKEN': process.env.REACT_APP_TOKEN,
            'X-DRO-SOURCE': process.env.REACT_APP_SOURCE,
            'Content-Type': 'application/json',
            'X-DRO-TIMEZONE': process.env.REACT_APP_TIMEZONE,
            'X-DRO-LANGUAGE': language?.language|| process.env.REACT_APP_LANGUAGE,
          },
        }
      );
      //const response = await axios.get('/DashBoard.json');
      console.log(response.data,'-------DashBoard Api Value-------');
      const { userSurveySessions } = response.data;
      let dataVal = response.data;
      if (userSurveySessions && userSurveySessions.length > 0) {
        const userSurveySessionId = userSurveySessions[0].surveySessionInfo.userSurveySessionId
        ;
        thunkAPI.dispatch(setUserSurveySessionId(userSurveySessionId));
        //return userSurveySessionId;
        return [userSurveySessionId, dataVal];
      } else {
        throw new Error('No user survey sessions found');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const saveSurveyResponse = createAsyncThunk(
  'survey/saveSurveyResponse',
  async (surveyData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}peapp/user/survey/updateSurveyResponse`,
        surveyData,
        {
          headers: {
            'X-DRO-TOKEN': process.env.REACT_APP_TOKEN,
            'X-DRO-SOURCE': process.env.REACT_APP_SOURCE,
            'Content-Type': 'application/json',
            'X-DRO-TIMEZONE': process.env.REACT_APP_TIMEZONE,
            'X-DRO-LANGUAGE': process.env.REACT_APP_LANGUAGE,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

