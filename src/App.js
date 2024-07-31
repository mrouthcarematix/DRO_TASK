import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartPage from './components/StartPage';
import Survey from './components/Survey';
import QuestionPage from './components/QuestionPage';
import ThankYou from './components/ThankYou';

const App = () => {
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
