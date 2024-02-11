const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const adminSchema = new mongoose.Schema({
    companyName: String,
    email: {type: String,required: true,unique: true},
    password: String,
    phoneNumber: Number,
    alternativeNumber: Number,
    plan: String,
    isSuperAdmin: {type:Boolean,default: false}
  })

adminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({_id:this._id},process.env.JWT_TOKEN,{expiresIn: '10m'})
  console.log(token);
  return token
}

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin;