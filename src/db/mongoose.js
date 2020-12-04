//jshint esversion:6
const mongoose=require("mongoose");

mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser:true ,
     useUnifiedTopology: true,
     useCreateIndex:true,
     useFindAndModify: false});





