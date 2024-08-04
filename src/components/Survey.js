import React, { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchSurvey,fetchDashboardData } from '../features/survey/surveyThunk';
import './Survey.css';
import doctorCheckupImage from '../assets/image/doctor-checkup.jpg';

const Survey = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { survey, loading, error, currentPage, userSurveySessionId } = useSelector((state) => state.survey);
  const [dataVal, setDataVal] = useState(null);
  const [surveyName, setSurveyName] = useState('');
  const selectedLanguage = location.state?.selectedLanguage || 'EN';
  const characterLimit = 25;
  const [expandedInstructions, setExpandedInstructions] = useState({});
  const [language, setLanguage] = useState(selectedLanguage);

  useEffect(() => {
    const loadData = async () => {
      const resultAction = await dispatch(fetchDashboardData({ language: selectedLanguage }));
      if (fetchDashboardData.fulfilled.match(resultAction)) {
        const [userSurveySessionId, dataVal] = resultAction.payload;
        setDataVal(dataVal);
        setSurveyName(dataVal.userSurveySessions[0].surveyName);
        dispatch(fetchSurvey(userSurveySessionId));
      }
    };

    loadData();
  }, [dispatch,selectedLanguage]);

  useEffect(() => {
    // if (survey && survey.language) {
    //   const languageCode = survey.language.toLowerCase();
    //   if (['en', 'hn', 'es','ru'].includes(languageCode)) {
    //     i18n.changeLanguage(languageCode);
    //   } else {
    //     console.warn(`Unsupported language code: ${languageCode}`);
    //   }
    // }
    const languageCode = selectedLanguage.toLowerCase();
    i18n.changeLanguage(languageCode);

  }, [survey, i18n]);

  useEffect(() => {
    if (survey) {
      let count=0;
      let page =0;
      const userSurveySessionDetail = survey.userSurveySession?.userSurveySessionDetail;
      if (userSurveySessionDetail) {
        const { progressStatus} = userSurveySessionDetail;
        if(survey.userSurveySession.userAnswerLogs.length>0) {
          page = survey.pages[0].id;
          count = (survey.userSurveySession.userSurveySessionDetail.lastAnswerPageId-page);
        }
        if (progressStatus === 'NOT_STARTED') {
          navigate('/start');
        } else if (progressStatus === 'EXPIRED' || progressStatus === 'STARTED') {
          navigate(`/question/${count}`,{ state: { selectedLanguage: language } });
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
      navigate(`/question/${currentPage}`,{ state: { selectedLanguage: language } });
    } else {
      console.error('Survey pages are undefined');
    }
  };
  const truncateText = (text, limit) => {
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
  };

  const handleToggleExpand = (index) => {
    setExpandedInstructions(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  return (
    <div className="container survey-container">
      <div className="survey-header">
        <div>
          <h1 className="survey-title">{surveyName}</h1>
          <p className="survey-subtitle">
            <span className="organization-name">{survey?.programInfo?.organizationName}</span>
            {' : '}
            <span className="program-name">{survey?.programInfo?.programName}</span>
          </p>
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
                <p className="card-text">
                  {expandedInstructions[index] || instruction.description.length <= characterLimit
                    ? instruction.description
                    : truncateText(instruction.description, characterLimit)
                  }
                  {instruction.description.length > characterLimit && (
                    <p
                      className="see-more-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleExpand(index);
                      }}
                    >
                      {expandedInstructions[index] ? t('seeLess') : t('seeMore')}
                    </p>
                  )}
                </p>
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
          bottom: '4rem',
          color: 'white',
          position: 'absolute',
          right: '4rem',
          fontSize: '1.2rem',
          padding: '-0.25rem 2rem',
          borderRadius: '5px',
        }}
      >
        {t('continueToQuestions')}
      </button>
    </div>
  );
};

export default Survey;
