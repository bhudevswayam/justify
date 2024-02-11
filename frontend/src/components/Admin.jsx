import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './admin.css'
const Admin = () => {
  const [questionTitles, setQuestionTitles] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [displayExams, setDisplayExams] = useState(true);
  const [users, setUsers] = useState([]);
  const [admin,setAdmin] = useState('');
  const [profileImgTrim,setProfileImgTrim] = useState('')
  const adminUserId = localStorage.getItem("adminId")
  const navigate = useNavigate()
  useEffect(() => {
    const fetchQuestionTitles = async () => {
      try {
        const response = await axios.get(`https://apptest-88ck.onrender.com/questions/titles/${adminUserId}`);
        setQuestionTitles(response.data);
      } catch (error) {
        console.error('Error fetching question titles:', error.message);
      }
    };

    fetchQuestionTitles();
  }, [adminUserId]);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`https://apptest-88ck.onrender.com/admin-details/${adminUserId}`);
        setAdmin(response.data);
        setProfileImgTrim(response.data)
      } catch (error) {
        console.error('Error fetching question titles:', error.message);
      }
    };

    fetchAdmin();
  }, [adminUserId, profileImgTrim]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://apptest-88ck.onrender.com/users/${adminUserId}`)
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsers();
  }, [adminUserId]);

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }
  // const generateExamLink = () =>{
  //   document.getElementById('examlink').innerHTML = `hola amigo`
  // }

  const handleQuestionClick = async (questionId) => {
    try {
      const response = await axios.get(`https://apptest-88ck.onrender.com/get-question/${questionId}`);
      setSelectedQuestion(response.data);
      setDisplayExams(false); // Set to false when a question is clicked
    } catch (error) {
      console.error('Error fetching question:', error.message);
    }
  };

  const handleGoToExamsClick = () => {
    setDisplayExams(true);
    setSelectedQuestion(null); // Clear selected question when going to exams
  };
  let trimName = profileImgTrim.trim('')
  console.log(trimName);
  let profileImg = trimName[0]
  return (
    <div className='admin'>
      <div className='navbar'>
      <div className='adminbtns'>
        <Link to='/question'><button>Generate Question</button></Link>
        <button onClick={handleGoToExamsClick}>Go to Examinies</button>
        </div>
        <div className='profile'>
          {admin} <span id='profilePic'>{profileImg}
          <button id='logOut' onClick={handleLogout}>Logout</button></span>
        </div>
      </div>
      <div className='adminMain'>
        <div className='questionList'>
          <h2>Question Titles:</h2>
          <ul>
            {questionTitles.map((question) => (
              <li key={question._id} onClick={() => handleQuestionClick(question._id)}>
                {question.title}
              </li>
            ))}
         
          </ul>
        </div>
        {displayExams ? (
          <div className='usersHero'>
            <h1>User Details:</h1>
            <ul>
              
                <li>
                  <p>Name</p>
                  <p>CGPA</p>
                  <p>Tab Change</p>
                  <p>View Details</p>
                </li>
            </ul>
            <ul>
              {users.map((user) => (
                <li key={user._id}>
                  <p>{user.name}</p>
                  <p>{user.cgpa}</p>
                  <p>{user.tabChange}</p>
                  <Link to={`/user-details/${user._id}`}>
                    <button>
                      View Details
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
        <div className='selectedQuestion'>
          {selectedQuestion && (
            <div>
              <h1>Title: </h1><h2>{selectedQuestion.title}</h2>
              <h2>Question: </h2><div dangerouslySetInnerHTML={{__html: selectedQuestion.question}}></div>
              <h2>Test time: {selectedQuestion.hour} hrs {selectedQuestion.minute} mins</h2>
              <h3>Test Cases:</h3>
              <ul>
                {selectedQuestion.testCases.map((testCase) => (
                  <li key={testCase._id}>
                    <span className='testCasesDisplay'>Input: </span><span className='testCasesop'>{testCase.input}</span>, <span className='testCasesDisplay'>Expected Output: </span><span className='testCasesop'> {testCase.expectedOutput}</span>
                  </li>
                ))}
              </ul>
              {/* <button className='examLink' onClick={generateExamLink}>Generate Exam Link</button> */}
              <h2 id='examlink'>Exam Link: http://localhost:5173/test?questionid={selectedQuestion._id}</h2>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
