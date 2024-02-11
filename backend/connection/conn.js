const mongoose = require('mongoose');
require("dotenv").config()
mongoose.connect(process.env.MONGOURL).then(()=>console.log('connected to DB')).catch((e)=>console.log(e));
