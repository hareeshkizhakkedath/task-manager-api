//jshint esversion:8
const express=require("express");
const app=express();
const Task=require("./models/task");
const User=require("./models/user");
require("./db/mongoose");
const userRouter=require("./Router/user");
const port=process.env.PORT;
app.use(express.json());
const taskRouter=require("./Router/task");
app.use(userRouter);
app.use(taskRouter);
const jwt=require("jsonwebtoken");



const bcrypt=require("bcrypt");
module.exports=app;