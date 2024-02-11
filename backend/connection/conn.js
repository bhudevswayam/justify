const mongoose = require('mongoose');
require("dotenv").config()
mongoose.connect('mongodb+srv://swayampandya1236:XJH1vqHISV3edhLh@cluster0.99umidx.mongodb.net/?retryWrites=true&w=majority').then(()=>console.log('connected to DB')).catch((e)=>console.log(e));
