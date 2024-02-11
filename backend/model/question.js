const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: String,
    question: String,
    testCases: [
      {
        input: String,
        expectedOutput: String,
      },
    ],
    hour: Number,
    minute: Number,
    adminUser: String
  });
  
  const Question = mongoose.model('Question', questionSchema);
  
module.exports = Question;