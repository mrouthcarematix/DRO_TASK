import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSurvey, fetchDashboardData } from '../features/survey/surveyThunk';

const StartPage = () => {
  const { survey } = useSelector((state) => state.survey);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [language, setLanguage] = useState('EN');
  const [dataVal, setDataVal] = useState(null);

  const handleLanguageChange = async (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    await dispatch(fetchDashboardData({ language: selectedLanguage }));
    i18n.changeLanguage(selectedLanguage.toLowerCase());
  };

  const handleStartSurvey = () => {
    navigate('/survey', { state: { selectedLanguage: language } });
  };

  return (
    <div className="container text-center start-page">
      <div className="my-5">
        <div className="d-flex justify-content-end">
          <select value={language} onChange={handleLanguageChange}>
            <option value="EN" selected>English</option>
            <option value="RU">Russian</option>
          </select>
        </div>
        <h1 className="display-4">{t('welcomeTitle')}</h1>
        <p className="lead">{t('startMessage')}</p>
        <button className="btn btn-primary btn-lg" onClick={handleStartSurvey}>
          {t('startSurvey')}
        </button>
      </div>
    </div>
  );
};

export default StartPage;
