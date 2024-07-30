import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { nextPage, prevPage, setCurrentPage, setAnswer } from '../features/survey/surveySlice';
import i18n from '../i18n';
import './QuestionPage.css';
import StarRatings from 'react-star-ratings';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const QuestionPage = () => {
  const { t } = useTranslation();
  const { pageIndex } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { survey, currentPage, answers } = useSelector((state) => state.survey);
  const currentPageIndex = parseInt(pageIndex, 10);

  const [userAnswer, setUserAnswer] = useState(answers[currentPageIndex] || {});
  const [showResults, setShowResults] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  if (!survey) return <div>No survey data available</div>;

  const page = survey.pages[currentPageIndex];
  if (!page) return <div>No such page</div>;

  const section = page.sections?.[0];
  if (!section) return <div>No sections available</div>;

  const question = section.questions?.[0];
  if (!question) return <div>No questions available</div>;

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      dispatch(prevPage());
      navigate(`/question/${currentPageIndex - 1}`);
    }
    setErrorMessage('');
  };

  const handleNext = () => {
    if (question.required && Object.keys(userAnswer).length === 0) {
      setErrorMessage('This question is required.');
      return;
    } else {
      setErrorMessage('');
    }

    dispatch(setAnswer({ pageIndex: currentPageIndex, answer: userAnswer }));
    if (currentPageIndex < survey.pages.length - 1) {
      dispatch(nextPage());
      navigate(`/question/${currentPageIndex + 1}`);
    }
  };

  const handleSave = () => {
    dispatch(setAnswer({ pageIndex: currentPageIndex, answer: userAnswer }));
    //setShowResults(true);
    dispatch(setAnswer({ pageIndex: currentPageIndex, answer: userAnswer }));
    navigate('/different-page');
  };

  const handleSkip = () => {
    setErrorMessage('');
    dispatch(nextPage());
    navigate(`/question/${currentPageIndex + 1}`);
  };

  const handleAnswerChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setUserAnswer((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUserAnswer((prev) => ({
        ...prev,
        video: files[0],
      }));
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
    dispatch(setAnswer({ pageIndex: currentPageIndex, answer: userAnswer }));
    navigate('/different-page');
  };

  const renderQuestionContent = () => {
    switch (question.questionType) {
      case 'VIDEO':
        return (
          <div>
            <video width="320" height="240" controls>
              <source src={question.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {question.helpText && <p className="help-text">{question.helpText}</p>}
            {question.choices.map((choice) => (
              <div key={choice.id}>
                <input type="radio" id={choice.id} name="question" value={choice.id} onChange={handleAnswerChange} />
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
            {question.helpText && <p className="help-text">{question.helpText}</p>}
            {question.choices.map((choice) => (
              <div key={choice.id}>
                <input type="radio" id={choice.id} name="question" value={choice.id} onChange={handleAnswerChange} />
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
                {question.helpText && <p className="help-text">{question.helpText}</p>}
                {question.choices.map((choice) => (
                  <div key={choice.id}>
                    <input type="radio" id={choice.id} name="question" value={choice.id} onChange={handleAnswerChange} />
                    <label htmlFor={choice.id}>{choice.text}</label>
                  </div>
                ))}
              </div>
            );
          case 'RATING':
            return (
              <div>
                {question.helpText && <p className="help-text">{question.helpText}</p>}
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
                {question.helpText && <p className="help-text">{question.helpText}</p>}
                <input type="file" accept="image/*" name="image" onChange={(e) => handleAnswerChange({ target: { name: 'image', value: e.target.files[0] } })} />
              </div>
            );
          case 'VIDEO_UPLOAD':
            return (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
              >
                {question.helpText && <p className="help-text">{question.helpText}</p>}
                <input
                  type="file"
                  accept="video/*"
                  name="video"
                  onChange={(e) => handleAnswerChange({ target: { name: 'video', value: e.target.files[0] } })}
                />
                <p>Drag and drop a video file here or click to upload.</p>
              </div>
            );
          case 'AUDIO_UPLOAD':
            return (
              <div>
                {question.helpText && <p className="help-text">{question.helpText}</p>}
                <input
                  type="file"
                  accept="audio/*"
                  name="audio"
                  onChange={(e) => handleAnswerChange({ target: { name: 'audio', value: e.target.files[0] } })}
                />
              </div>
            );
          case 'RICH_TEXT':
            return (
              <div>
                {question.helpText && <p className="help-text">{question.helpText}</p>}
                <textarea
                  rows="10"
                  cols="150"
                  name="richText"
                  onChange={handleAnswerChange}
                  className="large-textarea"
                />
              </div>
            );
          case 'CHECK_BOX':
            return (
              <div>
                {question.helpText && <p className="help-text">{question.helpText}</p>}
                {question.choices.map((choice) => (
                  <div key={choice.id}>
                    <input type="checkbox" id={choice.id} name="question" value={choice.id} onChange={handleAnswerChange} />
                    <label htmlFor={choice.id}>{choice.text}</label>
                  </div>
                ))}
              </div>
            );
          case 'BP':
            return (
              <div>
                {question.helpText && <p className="help-text">{question.helpText}</p>}
                <input
                  type="text"
                  placeholder=""
                  name="systolic"
                  onChange={handleAnswerChange}
                  style={{
                    width: '300px',
                    height: '40px',
                    padding: '10px',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                  }}
                />
              </div>
            );
          case 'SLIDER_WITH_SCALE':
            return (
              <div>
                {question.helpText && <p className="help-text">{question.helpText}</p>}
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={userAnswer.slider || 0}
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
                {question.helpText && <p className="help-text">{question.helpText}</p>}
                <select name="dropdown" onChange={handleAnswerChange}>
                  {question.choices.map((choice) => (
                    <option key={choice.id} value={choice.id}>
                      {choice.text}
                    </option>
                  ))}
                </select>
              </div>
            );
          case 'DATE':
            return (
              <div>
                {question.helpText && <p className="help-text">{question.helpText}</p>}
                <input type="date" name="date" onChange={handleAnswerChange} />
              </div>
            );
          case 'TIME':
            return (
              <div>
                {question.helpText && <p className="help-text">{question.helpText}</p>}
                <input type="time" name="time" onChange={handleAnswerChange} />
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
      return <div className="optional-message">This question is not mandatory. You can skip.</div>;
    }
    return null;
  };

  return (
    <div className="question-page">
      {renderErrorMessage()}
      <div className="header">
        <h1 className="title">Sample PRO</h1>
        <p className="subtitle">Internal : Normal Scheduled RU ZH</p>
        <hr className="divider" />
        <div className="question-progress">
          <span className="question-number">Question {currentPageIndex + 1} of {survey.pages.length}</span>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${calculateProgress()}%` }}></div>
          </div>
          <div className="navigation-buttons">
            <button className="close-button" onClick={handleOpenModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
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
            {currentPageIndex > 0 && (
              <button onClick={handlePrevious} className="nav-button">
                {t('previous')}
              </button>
            )}
            {currentPageIndex < survey.pages.length - 1 ? (
              <>
                <button onClick={handleNext} className="nav-button">
                  {t('next')}
                </button>
                {['IMAGE_UPLOAD', 'VIDEO_UPLOAD', 'AUDIO_UPLOAD'].includes(question.answerType) && (
                  <button onClick={handleSkip} className="nav-button">
                    {t('skip')}
                  </button>
                )}
              </>
            ) : (
              <button onClick={handleSave} className="nav-button">
                {t('save')}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="content">
        <div className="question-section">
          <p className="question-text">
            {question.text}
          </p>
          <div className="question-content">
            {renderQuestionContent()}
          </div>
        </div>
      </div>
      {showResults && (
        <div className="results">
          <h3>{t('results')}</h3>
          <pre>{JSON.stringify(answers, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
