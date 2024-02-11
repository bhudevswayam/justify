// QuestionDetails.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuestionDetails = ({ match }) => {
  const { questionId } = match.params;
  const [question, setQuestion] = useState(null);
    console.log(questionId);
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const response = await axios.get(`https://apptest-88ck.onrender.com/get-question/${questionId}`);
        setQuestion(response.data);
      } catch (error) {
        console.error('Error fetching question details:', error.message);
      }
    };

    fetchQuestionDetails();
  }, [questionId]);

  return (
    <div>
      {question ? (
        <div>
          <h2>{question.title}</h2>
          <p>{question.question}</p>
          <h3>Test Cases:</h3>
          <ul>
            {question.testCases.map((testCase) => (
              <li key={testCase._id}>
                Input: {testCase.input}, Expected Output: {testCase.expectedOutput}
              </li>
            ))}
          </ul>
        
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default QuestionDetails;
