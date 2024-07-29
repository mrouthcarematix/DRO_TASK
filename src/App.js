import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import Survey from './components/Survey';
import QuestionPage from './components/QuestionPage';
import StartPage from './components/StartPage';
import ThankYou from './components/ThankYou';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
        <Route path="/" element={<StartPage />} />
          <Route path="/Survey" element={<Survey />} />
          <Route path="/question/:pageIndex" element={<QuestionPage />} />
          <Route path="/different-page" element={<ThankYou />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
