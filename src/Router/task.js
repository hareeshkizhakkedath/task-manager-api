//jshint esversion:9
const express=require("express");
const routers=new express.Router();
const Task=require("../models/task");
const auth=require("../midleware/auth");

routers.post("/tasks",auth,async(req,res)=>{
    
    const task=new Task({
        ...req.body,
        owner:req.user._id
    });
    try{
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send();
    }

    // task.save().then(()=>{
    //     res.send(task);
    // }).catch((e)=>{
    //     res.status(400);
    //     res.send(e);
    // });
});

//Get /tasks?completed=true
//Get /tasks?limit=10&skip=20
//Get /tasks?sortBy=createdAt_asc

routers.get("/tasks",auth,async(req,res)=>{

    const match={};
    const sort={};

    if(req.query.completed){
        match.completed= (req.query.completed==="true");
        console.log(match.completed);
    }
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(":");
        sort[parts[0]]=parts[1]==="desc"?-1:1;
    }
    try{
        await req.user.populate({
            path:"tasks",
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    }catch(e){
        res.status(500).send();     
    }
    // Task.find({}).then((task)=>{
    //     res.send(task);
    // }).catch((e)=>{
    //     res.send(e);
    // });
});

routers.get("/tasks/:id",auth,async(req,res)=>{
    const _id=req.params.id;
    try{
        // const task= await Task.findById(_id);
        const task= await Task.findOne({_id,owner:req.user._id});
        if(!task){
            return res.status(404).send();
        }

        res.send(task);
    }catch(e){
        res.status(500).send();
    }
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send();
    //     }
    //     res.send(task);
    // }).catch((e)=>{
    //     res.status(500).send(e);
    // });
});
routers.patch("/tasks/:id",auth, async (req,res)=>{
    const allowedUpdates=["description","completed"];
    const updates=Object.keys(req.body);
    const isValidOperation=updates.every((update)=>{
        return allowedUpdates.includes(update);
    });
    if(!isValidOperation){
        return res.status(400).send({error:"invalid update"});
    }

    try{
        // const task=await Task.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true});
        const task=await Task.findOne({_id: req.params.id,owner:req.user._id});


        if(!task){
            return res.status(404).send({error:"invalid updatesaaa"});
        }
        updates.forEach((update) => {
            task[update]=req.body[update]  ;          
        });
        await task.save();
        res.send(task);
    }catch(e){
        res.status(404).send({error:"invalid updatesooooo"});
    }
});

routers.delete("/tasks/:id",auth, async(req,res)=>{
    try{
        const task=await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id});
        if(!task){
            res.status(404).send();
        }
        res.send(task);
    }
    catch(e){
        res.status(404).send();
    }
});



module.exports=routers;