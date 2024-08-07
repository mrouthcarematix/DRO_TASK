import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { nextPage, prevPage, setCurrentPage, setAnswer } from '../features/survey/surveySlice';
import i18n from '../i18n';
import './QuestionPage.css';
import StarRatings from 'react-star-ratings';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faInfoCircle,faHome} from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import customVideoUploadIcon from '../assets/image/camera.png';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { saveSurveyResponse,fetchDashboardData,fetchSurveySession } from '../features/survey/surveyThunk';

const QuestionPage = () => {
  const { t } = useTranslation();
  const { pageIndex } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { survey, answers } = useSelector((state) => state.survey);
  const currentPageIndex = parseInt(pageIndex, 10);
  const [userAnswer, setUserAnswer] = useState(answers[currentPageIndex] || { question: [] });
  const [showResults, setShowResults] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHelpText, setShowHelpText] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const selectedLanguage = location.state?.selectedLanguage || 'EN';
  const [language, setLanguage] = useState(selectedLanguage);
  const [userSurveySessionDetail, setUserSurveySessionDetail] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedScaleValue, setselectedScaleValue] = useState('');
  const [surveyName, setSurveyName] = useState('');
  const [dataVal, setDataVal] = useState(null);


  useEffect(() => {
    const loadData = async () => {
      const resultAction = await dispatch(fetchDashboardData({ language: selectedLanguage }));
      if (fetchDashboardData.fulfilled.match(resultAction)) {
        const [userSurveySessionId, dataVal] = resultAction.payload;
        setDataVal(dataVal);
        setSurveyName(dataVal.userSurveySessions[0].surveyName);
        dispatch(fetchSurveySession(userSurveySessionId))
          .unwrap()
          .then((result) => {
            setUserSurveySessionDetail(result);
            //const mappedAnswers = {};
            result.userAnswerLogs.forEach((log) => {
              let answer = {                
                question: '',
                richText: '',
                systolic: '',
                diastolic: '',
                slider: '',
                rating: '',
                dropdown: '',
                date: '',
                time: ''
              };
              console.log(log,'---log---');
              if (log.questionId == 2774) {
                answer = { question: log.choiceId ? String(log.choiceId) : '' };
                dispatch(setAnswer({ pageIndex: 0, answer }))
              }else if (log.questionId == 2775) {
                answer = { question: log.choiceId ? String(log.choiceId) : '' };
                dispatch(setAnswer({ pageIndex: 1, answer }))
              }else if (log.questionId == 2776) {
                answer = { question: log.choiceId ? String(log.choiceId) : '' };
                dispatch(setAnswer({ pageIndex: 2, answer }))
              }else if (log.questionId == 2918) {
                answer = { question: log.choiceId ? String(log.choiceId) : '' };
                dispatch(setAnswer({ pageIndex: 11, answer }))
              } 
              else if (log.questionId == 2777) {
                answer = { rating: isNaN(Number(log.answerFreeText)) ? log.answerFreeText : Number(log.answerFreeText) };
                dispatch(setAnswer({ pageIndex: 3, answer }))
              } else if (log.questionId == 2781) {
                answer = { richText: log.answerFreeText };
                dispatch(setAnswer({ pageIndex: 7, answer }))
              } else if (log.questionId == 2782) {
                answer = { question: log.answerFreeText.split(',') || [] };
                dispatch(setAnswer({ pageIndex: 8, answer }))
              } else if (log.questionId == 2783) {
                const [systolic, diastolic] = log.answerFreeText.split('/');
                answer = { systolic: systolic || '', diastolic: diastolic || '' };
                dispatch(setAnswer({ pageIndex: 9, answer }))
              } else if (log.questionId == 2784) {
                answer = { slider: log.answerFreeText };
                setselectedScaleValue(log.answerFreeText);
                dispatch(setAnswer({ pageIndex: 10, answer }))
              } else if (log.questionId == 2785) {
                answer = { dropdown: log.answerFreeText };
                setSelectedValue(log.answerFreeText);
                dispatch(setAnswer({ pageIndex: 11, answer }))
              } else if (log.questionId == 2786) {
                answer = { date: log.answerFreeText };
                dispatch(setAnswer({ pageIndex: 12, answer }))
              } else if (log.questionId == 2787) {
                answer = { time: log.answerFreeText };
                dispatch(setAnswer({ pageIndex: 13, answer }))
              }
            });
          })
          .catch((error) => {
            console.error('Error fetching survey:', error);
          });
      }
    };
    
    loadData();
  }, [dispatch, selectedLanguage]);

  useEffect(() => {
    dispatch(setCurrentPage(currentPageIndex));
  }, [currentPageIndex, dispatch]);

  useEffect(() => {
    if (survey && survey.language) {
      i18n.changeLanguage(survey.language.toLowerCase());
    }
  }, [survey]);

  useEffect(() => {
    setUserAnswer(answers[currentPageIndex] || {});
  }, [answers, currentPageIndex]);

  if (!survey || !survey.pages) return <div>No survey data available</div>;
  if (currentPageIndex < 0 || currentPageIndex >= survey.pages.length) return <div>Invalid page index</div>;

  const page = survey.pages[currentPageIndex];
  if (!page || !page.sections || !page.sections[0] || !page.sections[0].questions || !page.sections[0].questions[0]) {
    return <div>Invalid survey structure</div>;
  }
  const question1 = page.sections[0].questions[0];
  const question2 = page.sections[1]?.questions[0];
  const question = {
    ...question2,
    ...question1,
  };
  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      dispatch(setAnswer({ pageIndex: currentPageIndex, answer: userAnswer }));
      dispatch(prevPage());
      navigate(`/question/${currentPageIndex - 1}`,{ state: { selectedLanguage: language } });
    }
    setErrorMessage('');
  };

  const handleNext = () => {
    
    if (question.answerType == 'RICH_TEXT') {
      if (!userAnswer.richText || userAnswer.richText.trim() == '' || userAnswer.richText.trim() == '<p><br></p>') {
        setErrorMessage('This question is required.');
        return;
      }
    }
    if (question.answerType == 'BP') {
      if (!userAnswer.diastolic || !userAnswer.systolic) {
        setErrorMessage('This question is required.');
        return;
      }
    }
    if (question.answerType == 'SLIDER_WITH_SCALE') {
      if (!userAnswer.slider) {
        setErrorMessage('This question is required.');
        return;
      }
    }
    if (question.required && Object.keys(userAnswer).length === 0) {
      setErrorMessage('This question is required.');
      return;
    }
    const data = userAnswer;
    if (Array.isArray(data.question) && data.question.length === 0) {
      setErrorMessage('This question is required.');
      return;
      
    
    } else {
      setErrorMessage('');
    }

    dispatch(setAnswer({ pageIndex: currentPageIndex, answer: userAnswer }));
    if (currentPageIndex < survey.pages.length - 1) {
      dispatch(nextPage());
      navigate(`/question/${currentPageIndex + 1}`,{ state: { selectedLanguage: language } });
    }
  };

  // const transformAnswersToRequiredFormat = () => {
  //   let previousSession;
  //   let value = 0;
  //   if (userSurveySessionDetail) {
  //       previousSession=userSurveySessionDetail;
  //       value = (100 - previousSession.userSurveySessionDetail.percentageComplete);
  //     }
  //   const endTime = Date.now();
  //   const totalTimeSpent = Math.floor((endTime - startTime) / 1000);
  //   const progressStatus = currentPageIndex === survey.pages.length - 1 ? 'COMPLETED' : 'STARTED';
  //   previousSession = userSurveySessionDetail;
  //   const finalTimeSpent = previousSession.userSurveySessionDetail.timeSpent ? previousSession.userSurveySessionDetail.timeSpent + totalTimeSpent : totalTimeSpent;
  //   const finalPercentageComplete = previousSession.userSurveySessionDetail.percentageComplete ? previousSession.userSurveySessionDetail.percentageComplete + value: ((currentPageIndex + 1) / survey.pages.length) * 100;
  //   const transformedAnswers = {
  //     programUserID: 1145,
  //     id: 0,
  //     programSurveyId: 1075,
  //     pageNavigations: survey.pages.map((page, index) => ({
  //       previousPageId: index === 0 ? 0 : survey.pages[index - 1].id,
  //       currentPageId: page.id,
  //       nextPageId: index === survey.pages.length - 1 ? 0 : survey.pages[index + 1].id,
  //     })),
  //     scheduledSession: {
  //       userScheduleAssignId: 0,
  //       scheduledDate: 0,
  //       startTime: Date.now(),
  //       endTime: Date.now() + 7200000,
  //       scheduleType: "UNSCHEDULED",
  //       id: 0
  //     },
  //     userAnswerLogs: Object.entries(answers).map(([pageIndex, answer]) => {
  //       const question1 = survey.pages[pageIndex].sections[0].questions[0];
  //       const question2 = survey.pages[pageIndex].sections[1]?.questions[0];
  //       const question = {
  //         ...question2,
  //         ...question1,
  //       };
  //       const answerFreeText = answer.systolic && answer.diastolic 
  //         ? `${answer.systolic}/${answer.diastolic}`
  //         : Array.isArray(answer.question) 
  //         ? answer.question.join(',')
  //         : answer.slider || answer.rating || answer.richText || answer.dropdown || answer.date || answer.time || '';
  //       // return {
  //       //   choiceId: Number(answer.question) || 0,
  //       //   questionId: question.id,
  //       //   id: 0,
  //       //   answerFreeText,
  //       //   fileId: 0,
  //       //   score: question.score || 0
  //       // };
  //       if (pageIndex == 11) {
  //         return [
  //           {
  //             choiceId: Number(answer.question) || 0,
  //             questionId: question.id,
  //             id: 0,
  //             answerFreeText:'',
  //             fileId: 0,
  //             score: question.score || 0,
  //           },
  //           {
  //             choiceId: 0,
  //             questionId: question.id,
  //             id: 0,
  //             answerFreeText,
  //             fileId: 0,
  //             score: 0,
  //           }
  //         ];
  //       } else {
  //         return {
  //           choiceId: Number(answer.question) || 0,
  //           questionId: question.id,
  //           id: 0,
  //           answerFreeText,
  //           fileId: 0,
  //           score: question.score || 0,
  //         };
  //       }
  //     }),
  //     userSurveySessionDetail: {
  //       endTime: endTime,
  //       lastSubmissionTime: endTime,
  //       timeSpent: finalTimeSpent,
  //       declined: false,
  //       progressStatus: progressStatus,
  //       lastAnswerPageId: survey.pages[currentPageIndex].id,
  //       startTime: startTime,
  //       percentageComplete: finalPercentageComplete,
  //       id: 0
  //     },
  //     unscheduled: true
  //   };
  //   return transformedAnswers;
  // };
  const transformAnswersToRequiredFormat = () => {
    let previousSession;
    let value = 0;
    if (userSurveySessionDetail) {
      previousSession = userSurveySessionDetail;
      value = 100 - previousSession.userSurveySessionDetail.percentageComplete;
    }
    const endTime = Date.now();
    const totalTimeSpent = Math.floor((endTime - startTime) / 1000);
    const progressStatus = currentPageIndex === survey.pages.length - 1 ? 'COMPLETED' : 'STARTED';
    previousSession = userSurveySessionDetail;
    const finalTimeSpent = previousSession.userSurveySessionDetail.timeSpent
      ? previousSession.userSurveySessionDetail.timeSpent + totalTimeSpent
      : totalTimeSpent;
    const finalPercentageComplete = previousSession.userSurveySessionDetail.percentageComplete
      ? previousSession.userSurveySessionDetail.percentageComplete + value
      : ((currentPageIndex + 1) / survey.pages.length) * 100;
  
    const transformedAnswers = {
      programUserID: 1145,
      id: 0,
      programSurveyId: 1075,
      pageNavigations: survey.pages.map((page, index) => ({
        previousPageId: index === 0 ? 0 : survey.pages[index - 1].id,
        currentPageId: page.id,
        nextPageId: index === survey.pages.length - 1 ? 0 : survey.pages[index + 1].id,
      })),
      scheduledSession: {
        userScheduleAssignId: 0,
        scheduledDate: 0,
        startTime: Date.now(),
        endTime: Date.now() + 7200000,
        scheduleType: 'UNSCHEDULED',
        id: 0,
      },
      userAnswerLogs: Object.entries(answers).reduce((acc, [pageIndex, answer]) => {
        const question1 = survey.pages[pageIndex].sections[0].questions[0];
        const question2 = survey.pages[pageIndex].sections[1]?.questions[0];
        const question = {
          ...question2,
          ...question1,
        };
        const answerFreeText = answer.systolic && answer.diastolic
          ? `${answer.systolic}/${answer.diastolic}`
          : Array.isArray(answer.question)
          ? answer.question.join(',')
          : answer.slider || answer.rating || answer.richText || answer.dropdown || answer.date || answer.time || '';
  
        if (pageIndex == 11) {
          acc.push({
            choiceId: Number(answer.question) || 0,
            questionId: 2918,
            id: 0,
            answerFreeText:'',
            fileId: 0,
            score: question.score || 0,
          });
          acc.push({
            choiceId: 0,
            questionId: question.id,
            id: 0,
            answerFreeText,
            fileId: 0,
            score: 0,
          });
        } else {
          acc.push({
            choiceId: Number(answer.question) || 0,
            questionId: question.id,
            id: 0,
            answerFreeText,
            fileId: 0,
            score: question.score || 0,
          });
        }
        return acc;
      }, []),
      userSurveySessionDetail: {
        endTime: endTime,
        lastSubmissionTime: endTime,
        timeSpent: finalTimeSpent,
        declined: false,
        progressStatus: progressStatus,
        lastAnswerPageId: survey.pages[currentPageIndex].id,
        startTime: startTime,
        percentageComplete: finalPercentageComplete,
        id: 0,
      },
      unscheduled: true,
    };
    return transformedAnswers;
  };
  const handleSave = () => {
    if (question.answerType == 'TIME') {
      if (!userAnswer.time) {
        setErrorMessage('This question is required.');
        return;
      }
      else{
        const transformedData = transformAnswersToRequiredFormat();
        console.log(transformedData,'----transformedData-----'); 
        dispatch(saveSurveyResponse(transformedData));
        setShowResults(true);
        navigate(`/different-page`);
      }
    }
  };

  const handleSkip = () => {
    setErrorMessage('');
    dispatch(nextPage());
    navigate(`/question/${currentPageIndex + 1}`,{ state: { selectedLanguage: language }});
  };

  const handleAnswerChange = (event) => {
    const { name, value, checked } = event.target || {};
  
    if (question.answerType === 'CHECK_BOX') {
      const updatedAnswers = checked
        ? [...(Array.isArray(userAnswer.question) ? userAnswer.question : []), value]
        : userAnswer.question.filter((answer) => answer !== value);
      setUserAnswer((prevAnswer) => ({
        ...prevAnswer,
        question: updatedAnswers,
      }));
      dispatch(setAnswer({ pageIndex: currentPageIndex, answer: { ...userAnswer, question: updatedAnswers } }));
  
    } else if (question.answerType === 'BP') {
      setUserAnswer((prevAnswer) => ({
        ...prevAnswer,
        [name]: value,
      }));
      dispatch(setAnswer({ pageIndex: currentPageIndex, answer: { ...userAnswer, [name]: value } }));
  
    } 
    
    else if (question.answerType === 'SLIDER_WITH_SCALE') {
      setUserAnswer((prevAnswer) => ({
        ...prevAnswer,
        slider: value,
      }));
      dispatch(setAnswer({ pageIndex: currentPageIndex, answer: { ...userAnswer, slider: value } }));
  
    } else {
      setUserAnswer((prevAnswer) => ({
        ...prevAnswer,
        [name]: value,
      }));
      const answerToDispatch = { pageIndex: currentPageIndex, answer: { ...userAnswer, [name]: value } };
      console.log('Dispatching setAnswer with:', answerToDispatch);
      dispatch(setAnswer({ pageIndex: currentPageIndex, answer: { ...userAnswer, [name]: value } }));
      //console.log(setAnswer,'-setAnswer-----------');
    }
  };

  
  const calculateProgress = () => {
    return ((currentPageIndex + 1) / survey.pages.length) * 100;
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmClose = () => {
    setIsModalOpen(false);
    const transformedData = transformAnswersToRequiredFormat();
    console.log(transformedData,'----transformedData not full-----'); 
    dispatch(saveSurveyResponse(transformedData));
    setShowResults(true);
    navigate('/');
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoSrc(videoURL);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleAnswerChange({ target: { name: 'image', value: file } });
    }
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleAnswerChange({ target: { name: 'audio', value: file } });
    }
  };
  
  const handleRichTextChange = (value) => {
    setUserAnswer({ ...userAnswer, richText: value });
    dispatch(setAnswer({ pageIndex: currentPageIndex, answer: { richText: value } }));
  };

  const renderVideoUploadSection = () => (
    <div className="video-upload-container">
      <div className="video-upload-section">
        <label htmlFor="videoUpload" className="video-upload-label">
          <img src={customVideoUploadIcon} alt="Upload Video" className="upload-icon" />
          Please click on video icon to upload video
        </label>
        <input
          type="file"
          id="videoUpload"
          name="videoUpload"
          accept="video/*"
          onChange={handleVideoUpload}
          className="video-upload-input"
        />
      </div>
      {videoSrc && (
        <video controls className="video-preview">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
  const renderQuestionContent = () => {
    switch (question.questionType) {
      case 'VIDEO':
        return (
          <div>
            <video width="320" height="240" controls>
              <source src={question.url} type="video/mp4" />
            </video>
            {question.choices.map((choice) => (
              <div key={choice.id}>
                <input
                  type="radio"
                  id={choice.id}
                  name="question"
                  value={choice.id}
                  onChange={handleAnswerChange}
                  checked={userAnswer.question == choice.id}
                />
                <label htmlFor={choice.id}>{choice.text}</label>
              </div>
            ))}
          </div>
        );
      case 'AUDIO':
        return (
          <div>
            <audio controls>
              <source src={question.url} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            {question.choices.map((choice) => (
              <div key={choice.id}>
                <input
                  type="radio"
                  id={choice.id}
                  name="question"
                  value={choice.id}
                  onChange={handleAnswerChange}
                  checked={userAnswer.question == choice.id}
                />
                <label htmlFor={choice.id}>{choice.text}</label>
              </div>
            ))}
          </div>
        );
      case 'GENERAL':
        switch (question.answerType) {
          case 'RADIO_BUTTON':
            return (
              <div>
                {question.choices.map((choice) => (
                  <div key={choice.id}>
                    {choice.url && (
                      <div>
                        <div className="image-preview">
                          <img src={choice.url} alt="Uploaded" />
                        </div>
                      </div>
                    )}
                    <input
                      type="radio"
                      id={choice.id}
                      name="question"
                      value={choice.id}
                      onChange={handleAnswerChange}
                      checked={userAnswer.question == choice.id}
                    />
                    <label htmlFor={choice.id}>{choice.text}</label>
                  </div>
                ))}
              </div>
            );
          case 'RATING':
            return (
              <div>
                <StarRatings
                  rating={userAnswer.rating || 0}
                  starRatedColor="blue"
                  changeRating={(newRating) => handleAnswerChange({ target: { name: 'rating', value: newRating } })}
                  numberOfStars={5}
                  starDimension="40px"
                  starSpacing="15px"
                  name="rating"
                />
              </div>
            );
            case 'IMAGE_UPLOAD':
              return (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={(e) => handleImageUpload(e)}
                  />
                  {userAnswer.image && (
                    <div className="image-preview">
                      <img src={URL.createObjectURL(userAnswer.image)} alt="Uploaded" />
                    </div>
                  )}
                </div>
              );
            
          case 'VIDEO_UPLOAD':
            return renderVideoUploadSection();
          case 'AUDIO_UPLOAD':
            return (
              <div>
                <input
                  type="file"
                  accept="audio/*"
                  name="audio"
                  onChange={(e) =>handleAudioUpload(e)}
                />
                {userAnswer.audio && (
                  <div>
                    <audio controls>
                      <source src={URL.createObjectURL(userAnswer.audio)} type="audio/*" />
                    </audio>
                  </div>
                )}
              </div>
            );
            case 'RICH_TEXT':
              return (
                <ReactQuill
                  className="large-text-editor"
                  value={userAnswer.richText || ''}
                  name="richText"
                  onChange={handleRichTextChange}
                />
              );
            
            case 'CHECK_BOX':
              return (
                <div>
                  {question.choices.map((choice) => {
                    const choiceIdString = String(choice.id); 
                    return (
                      <div key={choice.id}>
                        <input
                          type="checkbox"
                          id={choice.id}
                          name="question"
                          value={choice.id}
                          onChange={handleAnswerChange}
                          checked={userAnswer.question?.includes(choiceIdString)}
                        />
                        <label htmlFor={choice.id}>{choice.text}</label>
                      </div>
                    );
                  })}
                </div>
              );
              case 'BP':
                return (
                  <div>
                    <input
                      type="number"
                      placeholder="Systolic"
                      name="systolic"
                      onChange={handleAnswerChange}
                      style={{
                        width: '300px',
                        height: '40px',
                        padding: '10px',
                        fontSize: '1rem',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        marginRight: '10px'
                      }}
                      value={userAnswer.systolic || ''}
                    />
                    <input
                      type="number"
                      placeholder="Diastolic"
                      name="diastolic"
                      onChange={handleAnswerChange}
                      style={{
                        width: '300px',
                        height: '40px',
                        padding: '10px',
                        fontSize: '1rem',
                        border: '1px solid #ccc',
                        borderRadius: '5px'
                      }}
                      value={userAnswer.diastolic || ''}
                    />
                  </div>
                );    
          case 'SLIDER_WITH_SCALE':
                  return (
                    <div>
                      <Slider
                        min={0}
                        max={10}
                        step={1}
                        value={userAnswer.slider || selectedScaleValue}
                        onChange={(value) => handleAnswerChange({ target: { name: 'slider', value } })}
                      />
                      <div className="slider-scale">
                        {[...Array(11)].map((_, i) => (
                          <span key={i} className="slider-scale-item">
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
          );
                
          case 'DROP_DOWN':
            return (
              <div>
                <select name="dropdown" onChange={handleAnswerChange} value={userAnswer.dropdown || selectedValue}>
                  {question.choices.map((choice) => (
                    <option key={choice.id} value={choice.id}>
                      {choice.text}
                    </option>
                  ))}
                </select>
                <p class="drop-down-text">
                {survey.pages[pageIndex].sections[1]?.questions[0].text}
                {survey.pages[pageIndex].sections[1]?.questions[0].helpText && (
                  <>
                    <FontAwesomeIcon icon={faInfoCircle} onClick={() => setShowHelpText(!showHelpText)} style={{ cursor: 'pointer' }} />
                    {showHelpText && <span className="help-text">{survey.pages[pageIndex].sections[1]?.questions[0].helpText}</span>}
                  </>
                )}</p>
                {survey.pages[pageIndex].sections[1]?.questions[0].choices.map((choice) => { 
                    return (
                      <div key={choice.id}>
                        <input
                          type="radio"
                          id={choice.id}
                          name="question"
                          value={choice.id}
                          onChange={handleAnswerChange}
                          checked={userAnswer.question == choice.id}
                        />
                        <label htmlFor={choice.id}>{choice.text}</label>
                      </div>
                    );
                  })}
              </div>
          );
          case 'DATE':
            return (
              <div>
                <input type="date" name="date" onChange={handleAnswerChange} value={userAnswer.date || ''} />
              </div>
            );
          case 'TIME':
            return (
              <div>
                <input type="time" name="time" onChange={handleAnswerChange} value={userAnswer.time || ''} />
              </div>
            );
          default:
            return null;
        }
      default:
        return null;
    }
  };

  const renderErrorMessage = () => {
    if (errorMessage) {
      return <div className="error-message">{errorMessage}</div>;
    }
    if (['IMAGE_UPLOAD', 'VIDEO_UPLOAD', 'AUDIO_UPLOAD'].includes(question.answerType)) {
      return <div className="optional-message"><FontAwesomeIcon icon={faInfoCircle} onClick={() => setShowHelpText(!showHelpText)} style={{ cursor: 'pointer' }} />This question is not mandatory. You can skip.</div>;
    }
    return null;
  };
  return (
    <div className="question-page">
      {renderErrorMessage()}
      <div className="header">
        <div className="home-icon">
          <FontAwesomeIcon icon={faHome} className="close-icon"/>
          <span className="close-text">DRO Home</span>
        </div>
        <button className="close-button" onClick={handleOpenModal}>
          <FontAwesomeIcon icon={faTimes} className="close-icon" />
          <span className="close-text">Close DRO</span>
        </button>
      </div>
      <h1 className="title">{surveyName}</h1>
      <p className="survey-subtitle">
        <span className="organization-name">{survey?.programInfo?.organizationName}</span>
          {' : '}
        <span className="program-name">{survey?.programInfo?.programName}</span>
      </p>
      <hr className="divider" />
      <div className="question-progress">
        <span className="question-number">Question {currentPageIndex + 1} of {survey.pages.length}</span>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${calculateProgress()}%` }}></div>
        </div>
        <div className="navigation-buttons">
          {currentPageIndex > 0 && (
            <button onClick={handlePrevious} className="nav-button previous">
              {t('previous')}
            </button>
          )}
          {currentPageIndex < survey.pages.length - 1 ? (
            <>
              <button onClick={handleNext} className="nav-button next">
                {t('next')}
              </button>
              {['IMAGE_UPLOAD', 'VIDEO_UPLOAD', 'AUDIO_UPLOAD'].includes(question.answerType) && (
                <a href='javascript:void(0)' onClick={handleSkip} className="skip-text">
                  {t('skip')}
                </a>
              )}
            </>
          ) : (
            <button onClick={handleSave} className="nav-button next">
              {t('save')}
            </button>
          )}
        </div>
      </div>
      <div className="content">
        <div className="question-section">
          <p className="question-text">
            {question.text}
            {question.helpText && (
              <>
                <FontAwesomeIcon icon={faInfoCircle} onClick={() => setShowHelpText(!showHelpText)} style={{ cursor: 'pointer' }} />
                {showHelpText && <span className="help-text">{question.helpText}</span>}
              </>
            )}
          </p>
          <div className="question-content">
            {renderQuestionContent()}
          </div>
        </div>
      </div>
      <Modal show={isModalOpen} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Navigation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to leave this page? Your answers will be saved.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmClose}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuestionPage;
