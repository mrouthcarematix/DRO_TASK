import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const StartPage = () => {
  const { survey } = useSelector((state) => state.survey);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (survey && survey.language) {
      const languageCode = survey.language.toLowerCase();
      if (['en', 'hn', 'es'].includes(languageCode)) {
        i18n.changeLanguage(languageCode);
      } else {
        console.warn(`Unsupported language code: ${languageCode}`);
      }
    }
  }, [survey, i18n]);

  const handleStartSurvey = () => {
    navigate('/Survey/');
  };

  return (
    <div className="container text-center start-page">
      <div className="my-5">
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
