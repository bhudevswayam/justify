const express = require('express');
const router = new express.Router();
const Admin = require('../model/admin');
const Question = require('../model/question');
const User = require('../model/user');

// const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();
const jwt = require('jsonwebtoken')
const axios = require('axios');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
  
    jwt.verify(token.split(' ')[1], process.env.JWT_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
      req.adminId = decoded._id;
      next();
    });
  };

router.post('/register-company',async (req,res)=>{
  try{
    // const {error} = validate(req.body)
    // if (error){
    //   return res.status(400).send({message: error.details[0].message})
    // }
    const user = await Admin.findOne({email : req.body.email});
    if (user){
      return res.status(409).send({message: 'User with given mail already exists!!!'})
    }
    const {companyName, email, password, phoneNumber,alternativeNumber, plan } = req.body;
    console.log('Request Body:', req.body);
    const newAdmin = new Admin({
      companyName,
      email,
      password,
      phoneNumber,
      alternativeNumber, 
      plan
    });

    const savedAdmin = await newAdmin.save();
    res.status(200).json(savedAdmin)
  }
  catch(error){
    res.status(500).send({message:'Internal server reeor'});
  }
})

// API endpoint to fetch admin details
router.get('/admin', verifyToken, async (req, res) => {
    try {
      // Check if the user is a super admin
      const admin = await Admin.findById(req.adminId);
      if (!admin || !admin.isSuperAdmin) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
      }
  
      // If the user is authorized, fetch all admin details
      const allAdmins = await Admin.find();
      res.json(allAdmins);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

router.post("/login", async (req, res) => {
    try {
      // const { error } = validate(req.body);
      // if (error)
      // 	return res.status(400).send({ message: error.details[0].message });
      const user = await Admin.findOne({ email: req.body.email });
      if (!user)
          return res.status(401).send({ message: "Invalid Email or Password" });

      
      const validPassword = req.body.password == user.password;
      if (!validPassword)
          return res.status(401).send({ message: "Invalid Email or Password" });

      const token = user.generateAuthToken();

      if(user.email === 'swayampandya1236@gmail.com'){
        const validPassword = req.body.password == user.password;

        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });

        res.status(200).send({ data: token, message: "logged in successfully", adminId: user._id, sAdmin: true });
      }
      else
        res.status(200).send({ data: token, message: "logged in successfully", adminId: user._id, sAdmin: false });
    } catch (e) {
    console.log(e);
        res.status(500).send({ message: "Internal Server Error is this" });
    }
});

// const validate = (data) => {
// 	const schema = Joi.object({
// 		email: Joi.string().email().required().label("Email"),
// 		password: Joi.string().required().label("Password"),
// 	});
// 	return schema.validate(data);
// };

router.post('/compile', async (req, res) => {
  const { language, code, input } = req.body;
  console.log(input);
  const options = {
    method: 'POST',
    url: 'https://online-code-compiler.p.rapidapi.com/v1/',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '1638b63548msh4199dfbcd8c5262p1674f6jsnfc1514501ce8',
      'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com',
    },
    data: {
      language,
      version : 'latest',
      code,
      input,
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error making API request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/upload-question', async (req, res) => {
  try {
    const {title, question, testCases, hour, minute, adminUser } = req.body;
    console.log('Request Body:', req.body);
    const newQuestion = new Question({
      title,
      question,
      testCases,
      hour,
      minute,
      adminUser,
    });

    const savedQuestion = await newQuestion.save();

    res.json(savedQuestion);
  } catch (error) {
    console.error('Error uploading question:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/register', async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      email,
      currentPackage,
      address,
      cgpa,
      universityName,
      startTime,
    } = req.body;

    const newUser = new User({
      name,
      phoneNumber,
      email,
      currentPackage,
      address,
      cgpa,
      universityName,
      
      startTime
    });

    const savedUser = await newUser.save();

    res.status(200).json(savedUser);
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/submit', async (req, res) => {
  try {
    const {givenQuestion, pasedTestCase, endTime, code, userId, adminUser } = req.body;

    // Combine update objects into a single object
    const updateObject = {
      adminUser: adminUser,
      givenQuestion: givenQuestion,
      pasedTestCase: pasedTestCase,
      endTime: endTime,
      code: code
    };

    // Update the user document with the provided data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateObject,
      { new: true } // Return the updated document
    );

    // Send the updated user document as the response
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/questions/titles/:adminUserId', async (req, res) => {
  const adminUserId = req.params.adminUserId;

  try {
    const questions = await Question.find({ adminUser: adminUserId }).select('title');
    res.json(questions);
  } catch (error) {
    console.error('Error fetching question titles:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/get-question/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/admin-details/:adminUserId', async (req, res)=>{
  const adminUserId = req.params.adminUserId;

  try{
    const admin = await Admin.findById(adminUserId)
    res.send(admin.companyName)
  }
  catch(error){
    console.error('Error fetching Admin:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
})
router.get('/users/:adminUserId', async (req, res) => {
  const adminUserId = req.params.adminUserId;

  try {
    // Find users associated with the given admin ID
    const users = await User.find({ adminUser: adminUserId });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users-detail/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/update-tab-change', async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user by userId and update the tabChange field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { tabChange: 1 } }, // Increment tabChange by 1
      { new: true } // Return the updated document
    );

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating tabChange:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/save-pictures/:userId', upload.array('pictures', 10), async (req, res) => {
  try {
    const userId = req.params.userId;
    const pictures = req.files; // 'pictures' should match the field name in the FormData

    // Update the user's pictures field
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $push: {
        pictures: pictures.map(file => ({
          data: file.buffer, // assuming 'buffer' contains the image data
          contentType: file.mimetype
        }))
      }
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, message: 'Pictures saved successfully' });
  } catch (error) {
    console.error('Error saving pictures:', error.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


router.get('/get-pictures/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      console.log('not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Retrieve all pictures from the user document
    const pictures = user.pictures || [];

    // Serve all images
    if (pictures.length > 0) {
      const pictureArray = pictures.map(picture => ({
        contentType: picture.contentType,
        data: picture.data
      }));
      // console.log(pictureArray);
      res.status(200).json(pictureArray);
    } else {
      res.status(404).json({ error: 'No pictures found' });
    }
  } catch (error) {
    console.error('Error retrieving pictures:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;