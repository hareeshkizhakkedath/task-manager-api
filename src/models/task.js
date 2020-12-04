//jshint esversion:6
//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 -->send grid key
const mongoose=require("mongoose");
const validator=require("validator");
const TaskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true,

    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }

},{
    timestamps:true
});


const Task=mongoose.model("Task",TaskSchema);
module.exports=Task;

