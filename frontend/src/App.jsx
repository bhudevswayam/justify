// Create a new React app using Create React App
// npx create-react-app code-compiler-app
// cd code-compiler-app

// src/App.js
import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Compiler from './components/Compiler';
import Question from './components/Question';
import Home from './components/Home';
import DisplayPictures from './components/Displaypictures.jsx';
import Admin from './components/Admin.jsx';
import UserDetails from './components/UserDetails.jsx';
import Signup from './components/Signin.jsx';
import Login from './components/Login.jsx';
import Protected from './components/Protected.jsx';
import Notfound from './components/Notfound.jsx';
import Thankyou from './components/Thankyou.jsx';
import SAdminProtect from './components/SAdminProtect.jsx';
import SAmdin from './components/SAmdin.jsx';
function App() {
  return <>
      <BrowserRouter>
      <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/test' element={<Home />} />
          <Route path="/compiler" element={<Compiler />} />
          <Route path="/question" element={<Protected Component={Question} />} />
          <Route path="/display" element={<Protected Component={DisplayPictures} />} />
          <Route path='/admin/:adminId' element={<Protected Component={Admin} />} />
          <Route path='/signup' element={<SAdminProtect Component={Signup} />} />
          <Route path='/login' element={<Login />} />
          <Route path="/user-details/:userId" element={<Protected Component={UserDetails} />} />
          <Route path='/thank-you' element={<Thankyou />} />
          <Route path='/s-admin' element={<SAdminProtect Component={SAmdin} />} />
          <Route path='*' element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  </>
}

export default App;
// app.get('/get-pictures/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     console.log(userId);

//     // Find the user by userId
//     const user = await User.findById(userId);

//     if (!user) {
//       console.log('not found');
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Retrieve all pictures from the user document
//     const pictures = user.pictures || [];

//     // Serve all images
//     if (pictures.length > 0) {
//       const pictureArray = pictures.map(picture => ({
//         contentType: picture.contentType,
//         data: picture.data
//       }));

//       res.json(pictureArray);
//     } else {
//       res.status(404).json({ error: 'No pictures found' });
//     }
//   } catch (error) {
//     console.error('Error retrieving pictures:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// const urlParams = new URLSearchParams(window.location.search);
//   const userId = urlParams.get('userId');