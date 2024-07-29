// src/components/ThankYou.js

import React from 'react';
import styled from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa';

const ThankYouContainer = styled.div`
  text-align: center;
  background: white;
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: auto;
`;

const IconWrapper = styled.div`
  color: #28a745;
  font-size: 4rem;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const Message = styled.p`
  color: #555;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const Button = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

const ThankYou = () => {
  return (
    <ThankYouContainer>
      <IconWrapper>
        <FaCheckCircle />
      </IconWrapper>
      <Title>Thank You!</Title>
      <Message>
        Your submission has been received. We appreciate your effort and will get back to you shortly.
      </Message>
      <Button onClick={() => window.location.href = '/'}>Go to Homepage</Button>
    </ThankYouContainer>
  );
};

export default ThankYou;
