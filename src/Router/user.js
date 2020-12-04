//jshint esversion:8
const express=require("express");
const User=require("../models/user");
const router=new express.Router();
const auth=require("../midleware/auth");
const multer=require("multer");
const sharp = require("sharp");
const {sendWelcomeEmail,sendCancelEmail}=require("../Emails/account");



router.post("/users",async (req,res)=>{
    const user=new User(req.body);
     
     try{
        await user.save();
        sendWelcomeEmail(user.email,user.name);
         const token= await user.generateAuthToken();
         res.status(201).send({user,token});
     }
     catch(e){
         res.status(400).send(e);
 
     }
 //    user.save().then(()=>{
 //         res.send(user);
 //    }).catch((e)=>{
 //        res.status(400);
 //         res.send(e);
 //    });
 });

router.post("/users/logout",auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send();
    }
});

router.post("/users/logoutAll",auth,async (req,res)=>{
    try{
        req.user.tokens=[];
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send();
    }
});

 router.get("/users/me",auth,async(req,res)=>{

    res.send(req.user);
    // User.find({ }).then((users)=>{
    //     res.send(users);
    // }).catch((e)=>{
    //     res.status(500).send();
    // });
});


    // User.findById(_id).then((user)=>{
    //     if(!user){
    //         return res.status(404).send();
    //     }
    //     res.send(user);
    // }).catch((e)=>{
    //     res.status(500);
    //     res.send(e);
    // });

    // console.log(req.params);
    const upload=multer({

        limits:{
            fileSize:1000000
        },
        fileFilter(req,file,cb){
            if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
                return cb(new Error("not the prescribed file type"));
            }
            cb(undefined,true);
        }
    });
router.post("/users/me/avatar",auth,upload.single("avatar"), async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    
    req.user.avatar=buffer;
    await req.user.save();
    res.send();
}, (error,req,res,next)=>{
    res.status.send({error:error.message});
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
         throw new Error();
        }
         res.set('Content-Type', 'image/png');
         res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
   });


router.delete("/users/me/avatar",auth,async(req,res)=>{
   req.user.avatar=undefined;
   await req.user.save();
   res.send(); 
});

router.patch("/users/me",auth,async (req,res)=>{
    const updates=Object.keys(req.body);
    const allowedUpdates=["name","email","password","age"];
    const isValidOperation=updates.every((update)=>
        allowedUpdates.includes(update)
    );
    if(!isValidOperation){
       res.status(400).send({error:"invalid updates"}); 
    }
    try{
        //const user= await User.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true});
        // const user =await User.findById(req.params.id);
        updates.forEach((update)=> req.user[update]=req.body[update]);
        await req.user.save();

        // if(!user){
        //     return res.status(404).send();
        // }
        res.send(req.user);

    }catch(e){
        res.status(400).send();
    }
});
router.delete("/users/me",auth,async (req,res)=>{
    try{
        // const user= await User.findByIdAndDelete(req.user._id);
        // if(!user){
        //     res.status(404).send();
        // }
        await req.user.remove();
        sendCancelEmail(req.user.email,req.user.name);
        res.send(req.user);
    }catch(e){
        res.status(404).send();
    }
});

router.post("/users/login",async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password);
        const token=await user.generateAuthToken();
        res.send({user,token});
    }catch(e){

        res.status(400).send();
    
    }
});

module.exports=router;