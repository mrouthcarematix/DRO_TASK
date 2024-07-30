import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchSurvey } from '../features/survey/surveyThunk';
import './Survey.css';
import doctorCheckupImage from '../assets/image/doctor-checkup.jpg';

const Survey = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { survey, loading, error, currentPage } = useSelector((state) => state.survey);

  useEffect(() => {
    dispatch(fetchSurvey());
  }, [dispatch]);

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

  useEffect(() => {
    if (survey) {
      const userSurveySessionDetail = survey.userSurveySession?.userSurveySessionDetail;

      if (userSurveySessionDetail) {
        const { progressStatus, lastAnswerPageId } = userSurveySessionDetail;
        if (progressStatus === 'NOT_STARTED') {
          navigate('/start');
        } else if (progressStatus === 'EXPIRED' || progressStatus === 'STARTED') {
          navigate(`/question/${lastAnswerPageId}`);
        } else if (progressStatus === 'COMPLETED') {
          navigate('/thankyou');
        }
      } else {
        console.warn('userSurveySessionDetail is undefined');
      }
    }
  }, [survey, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!survey) return <div>No survey data available</div>;

  const handleContinue = () => {
    if (survey && survey.pages) {
      navigate(`/question/${currentPage}`);
    } else {
      console.error('Survey pages are undefined');
    }
  };

  return (
    <div className="container survey-container">
      <div className="survey-header">
        <div>
          <h1 className="survey-title">{survey?.name}</h1>
          <p className="survey-subtitle">{survey?.programInfo?.organizationName} : {survey?.programInfo?.programName}</p>
        </div>
        <p className="estimated-time">{t('estimatedTimeToComplete')} :</p> <p className="estimated-time-value">{'10 mins'}</p>
      </div>
      <div className="text-center mb-4">
        <p className="survey-intro">{survey?.surveyIntroduction?.text}</p>
      </div>
      <div className="row text-center survey-instructions">
        {survey?.surveyInstructions?.slice(0, 4).map((instruction, index) => (
          <div key={index} className="col-md-3 mb-3">
            <div className="card h-100 instruction-card">
              <div className="card-body">
                <img 
                  src={`icon${index + 1}.png`} 
                  alt="Icon" 
                  className="instruction-icon" 
                  onError={(e) => e.target.src = doctorCheckupImage}
                />
                <p className="card-text">{instruction.description}</p>
                <a href="#" className="see-more-link">{t('seeMore')}</a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="btn continue-button"
        onClick={handleContinue}
        style={{
          backgroundColor: '#ff8c00',
          borderColor: '#ff8c00',
          bottom: '1rem',
          color: 'white',
          position: 'absolute',
          right: '2rem',
          fontSize: '1.25rem',
          padding: '0.75rem 2rem',
          borderRadius: '5px',
        }}
      >
        {t('continueToQuestions')}
      </button>
    </div>
  );
};

export default Survey;
