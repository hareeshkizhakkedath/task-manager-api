//jshint esversion:8
const mongoose=require("mongoose");
const jwt= require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const user1Id=new mongoose.Types.ObjectId();
const user1={
    _id:user1Id,
    name:"mike",
    email:"mike@example.com",
    password:"Mike@123",
    tokens:[{
        token:jwt.sign({_id:user1Id},process.env.JWT_SECRET)
    }]

};

const user2Id=new mongoose.Types.ObjectId();
const user2={
    _id:user2Id,
    name:"andrew",
    email:"andrew@example.com",
    password:"andrew@123",
    tokens:[{
        token:jwt.sign({_id:user2Id},process.env.JWT_SECRET)
    }]

};

const task1={
   _id:new mongoose.Types.ObjectId(),
   description:"first task" ,
   completed:false,
   owner:user1._id
}
const task2={
    _id:new mongoose.Types.ObjectId(),
    description:"second task" ,
    completed:true,
    owner:user1._id
 }

 const task3={
    _id:new mongoose.Types.ObjectId(),
    description:"third task" ,
    completed:true,
    owner:user2._id
 }

const setDatabase=async()=>{
    await User.deleteMany();
    await Task.deleteMany();
    await new User(user1).save();
    await new User(user2).save();
    await new Task(task1).save();
    await new Task(task2).save();
    await new Task(task3).save();
};

module.exports={
    user1Id,
    user1,
    user2Id,
    user2,
    task1,
    task2,
    task3,
    setDatabase
};