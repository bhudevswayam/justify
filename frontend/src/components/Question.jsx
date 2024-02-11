// AdminPanel.jsx

import React, { useState, useRef } from 'react';
import axios from 'axios';
import './question.css';
import JoditEditor from 'jodit-react';

const Question = () => {
  const editor = useRef(null);
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);
  const adminId = localStorage.getItem('adminId')
  const uploadQuestion = async () => {
    try {
      const response = await axios.post('https://apptest-88ck.onrender.com/upload-question', {
        title,
        question,
        testCases,
        hour,
        minute,
        adminUser : adminId
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error uploading question:', error.message);
    }
    window.location = `/admin/${adminId}`;
  };

  const handleTestCaseChange = (index, key, value) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index][key] = value;
    setTestCases(updatedTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  const removeTestCase = (index) => {
    const updatedTestCases = [...testCases];
    updatedTestCases.splice(index, 1);
    setTestCases(updatedTestCases);
  };

  return (
    <div className='question'>
      <h2>Upload Question</h2>
      <label>
        Question:
      </label>
      <input 
        placeholder='Title...'
        type='text' 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>
        Time:
      </label>
      <input 
        placeholder='Number of Hours'
        type='text' 
        value={hour}
        onChange={(e) => setHour(e.target.value)}
      />
      <input 
        placeholder='Number of Minutes'
        type='text' 
        value={minute}
        onChange={(e) => setMinute(e.target.value)}
      />
     {/* <textarea
        placeholder='Type Your Question Here....'
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      /> */}
      <div id='joitext'>
      <JoditEditor
			  ref={editor}
			  value={question}
			  // tabIndex={1} // tabIndex of textarea
			  // onBlur={(e) => setQuestion(e.target.value)} // preferred to use only this option to update the content for performance reasons
			  onChange={e => setQuestion(e)}
		  />
      </div>
      <div className='testCases'>
        <h3>Test Cases:</h3>
        <div className='addTestCase'>
          {testCases.map((testCase, index) => (
            <div key={index} className="testCase">
              <label>
                Input for Test Case:
                <textarea
                  type="text"
                  value={testCase.input}
                  onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                />
                Expected Output:
                <textarea
                  type="text"
                  value={testCase.expectedOutput}
                  onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                />
              </label>
              <button id='removeTestCase' type="button" onClick={() => removeTestCase(index)}>
                Remove Test Case
              </button>
            </div>
          ))}
        </div>
        <div id='testBtn'>
        <button type="button" onClick={addTestCase}>
          Add Test Case
        </button>
        <button type="button" onClick={uploadQuestion}>
          Upload Question
        </button>
        </div>
      </div>
    </div>
  );
};

export default Question;
