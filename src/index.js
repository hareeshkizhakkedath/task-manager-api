//jshint esversion:8
const express=require("express");
const app=express();

require("./db/mongoose");
const userRouter=require("./Router/user");
const port=process.env.PORT;
app.use(express.json());
const taskRouter=require("./Router/task");
app.use(userRouter);
app.use(taskRouter);
const jwt=require("jsonwebtoken");



app.listen(port,()=>{
    console.log("server up "+port);
});

const bcrypt=require("bcrypt");
// const myfunction=async ()=>{
//     const token=jwt.sign({_id:"abc123"},"secretcode",{expiresIn:"7 seconds"});
//     console.log(token);

//     const data=jwt.verify(token,"secretcode");
//     console.log(data);
// };
// myfunction();

const Task=require("./models/task");
const User=require("./models/user");

// const main=async ()=>{
//     // using a task find the user
//     // const task=await Task.findById("5fad129ced45a03f70ce10d0");
//     // await task.populate("owner").execPopulate();
//     // console.log(task.owner);
//     const user= await User.findById("5facf3c97d8fd001ec37b5ac");
//     await user.populate("tasks").execPopulate();
//     console.log(user.tasks);


// };
// main();
// const multer =require("multer");
// const upload=multer({
//     dest:"images"
// });
// app.post("/upload",upload.single("upload"),(req,res)=>{
//     res.send();
// });
