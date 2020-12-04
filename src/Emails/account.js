//jshint esversion:6

const sgMail = require('@sendgrid/mail');
const { getMaxListeners } = require('../models/task');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:"hareeshkizhakkedath@gmail.com",
        subject:"welcome to the app",
        text:`welcome ${name}. to task app`
    });
};
const sendCancelEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:"hareeshkizhakkedath@gmail.com",
        subject:"Good bye to app",
        text:`good bye ${name}. to task app`
    });
};
module.exports={
    sendWelcomeEmail,
    sendCancelEmail
};