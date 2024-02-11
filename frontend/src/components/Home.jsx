import React,{useState} from 'react'
import { Outlet, Link,  useNavigate, useParams } from "react-router-dom";

import axios from 'axios';
import './home.css';

const Home = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('questionid');
    const date = new Date();
    console.log(urlParams);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        currentPackage: '',
        address: '',
        cgpa: '',
        universityName: '',
        startTime: date,
      });
      const enterFullscreen = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen()
            .then(() => console.log('Fullscreen mode activated'))
            .catch(error => console.error('Error entering fullscreen mode:', error));
        }
       };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const response = await axios.post('https://apptest-88ck.onrender.com/register', formData);
      
          // Handle the response as needed (e.g., show a success message)
          console.log('User registered successfully:', response.data);
          const uid = response.data._id;
          // Enter fullscreen mode
          enterFullscreen();
          navigate(`/compiler?userId=${uid}&questionId=${questionId}`); // Fix the typo here
        } catch (error) {
          console.error('Error registering user:', error.message);
          // Handle the error (e.g., show an error message)
        }
      };
  return (
    <>
        <div className='home'>
            <img id='homeImg' src='https://media.istockphoto.com/id/1464628759/photo/fingerprint-scan-for-secure-access-and-service-unlock-design-concept.jpg?s=1024x1024&w=is&k=20&c=DpY8rb-bbtLh-GXpi6HVgfY6sK8Vtt7fsPPpJLK5bRk=' />
            <form className='home-form' onSubmit={handleSubmit}>
        <label>
          Name:
        </label>
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
          required
          autoFocus // Focus on this field if there's an error
          style={formData.name ? {} : { border: '1px solid red' }} // Apply red border if the field is empty
        />

        <label>
          Phone Number:
        </label>
        <input
          type='text'
          name='phoneNumber'
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          style={formData.phoneNumber ? {} : { border: '1px solid red' }}
        />

        <label>
          Email:
        </label>
        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          required
          style={formData.email ? {} : { border: '1px solid red' }}
        />

        <label>
          Current Package:
        </label>
        <input
          type='text'
          name='currentPackage'
          value={formData.currentPackage}
          onChange={handleChange}
          required
          style={formData.currentPackage ? {} : { border: '1px solid red' }}
        />

        <label>
          Address:
        </label>
        <textarea
          name='address'
          value={formData.address}
          onChange={handleChange}
          required
          style={formData.address ? {} : { border: '1px solid red' }}
        />

        <label>
          CGPA:
        </label>
        <input
          type='text'
          name='cgpa'
          value={formData.cgpa}
          onChange={handleChange}
          required
          style={formData.cgpa ? {} : { border: '1px solid red' }}
        />

        <label>
          University Name:
        </label>
        <input
          type='text'
          name='universityName'
          value={formData.universityName}
          onChange={handleChange}
          required
          style={formData.universityName ? {} : { border: '1px solid red' }}
        />

        <div className='link'>
          <button type='submit'>Submit</button>
        </div>
    </form>

        </div>
    </>
  )
}

export default Home

