import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Displaypicture from './Displaypictures';
import './userdetails.css'

const UserDetails = () => {
  const { userId } = useParams();
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [formattedsDate, setFormattedSDate] = useState('');
  const [formattedeDate, setFormattedEDate] = useState('');
  const adminUserId = localStorage.getItem("adminId");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`https://apptest-88ck.onrender.com/users-detail/${userId}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };

    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    if (userDetails) {
      const sdate = new Date(userDetails.startTime);
      const edate = new Date(userDetails.endTime);
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Kolkata' // Set the timezone to IST
      };

      setFormattedSDate(sdate.toLocaleString('en-IN', options));
      setFormattedEDate(edate.toLocaleString('en-IN', options));
    }
  }, [userDetails]);

  useEffect(() => {
    const handleQuestionClick = async () => {
      try {
        const response = await axios.get(`https://apptest-88ck.onrender.com/get-question/${userDetails?.givenQuestion}`);
        setSelectedQuestion(response.data);
      } catch (error) {
        console.error('Error fetching question:', error.message);
      }
    };

    if (userDetails) {
      handleQuestionClick();
    }
  }, [userDetails]);
  
  return (
    <div className='user-details'>
      <Link to={`/admin/${adminUserId}`}>
        <button>
          Back To admin
        </button>
      </Link>
      <h1>User Details:</h1>
      {userDetails && (
        <div className='main-user-details'>
          <h3><span>Name: </span>{userDetails.name}</h3>
          <h3><span>Phone Number: </span>{userDetails.phoneNumber}</h3>
          <h3><span>Email: </span>{userDetails.email}</h3>
          <h3><span>Current Package: </span>{userDetails.currentPackage}</h3>
          <h3><span>Address: </span>{userDetails.address}</h3>
          <h3><span>CGPA: </span>{userDetails.cgpa}</h3>
          <h3><span>University Name: </span>{userDetails.universityName}</h3>
          <h3><span>Tab Change: </span>{userDetails.tabChange}</h3>
          <h3><span>Exam Start Time: </span>{formattedsDate}</h3>
          <h3><span>Exam End Time: </span>{formattedeDate}</h3>
          <h3><span>Question: </span>{selectedQuestion?.title}</h3>
          <div className='userImgs'>
            <p>User Images</p>
            <Displaypicture userId={userId}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
