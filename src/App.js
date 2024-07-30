import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StartPage from './components/StartPage';
import Survey from './components/Survey';
import QuestionPage from './components/QuestionPage';
import ThankYou from './components/ThankYou';

const App = () => {
  const { survey } = useSelector((state) => state.survey);
  const progressStatus = survey?.progressStatus;

  const getInitialRoute = () => {
    switch (progressStatus) {
      case 'COMPLETED':
      case 'EXPIRED':
      case 'STARTED':
        return '/survey';
      case 'NOT_STARTED':
      default:
        return '/';
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/question/:pageIndex" element={<QuestionPage />} />
        <Route path="/different-page" element={<ThankYou />} />
      </Routes>
    </Router>
  );
};

export default App;
