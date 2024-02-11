const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
    email: String,
    currentPackage: String,
    address: String,
    cgpa: String,
    universityName: String,
    tabChange: {
      type: Number,
      default: 0,
    },
    adminUser: String,
    testDate : { type: Date, default: Date.now },
    startTime: Date,
    endTime: Date,
    code: String,
    givenQuestion: String,
    pasedTestCase: String,
    pictures: [{
      data: Buffer,
      contentType: String
    }],
    adminUser: String
  });
  
const User = mongoose.model('User', userSchema);

module.exports = User;