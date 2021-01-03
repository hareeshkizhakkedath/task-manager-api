//jshint esversion:8
const app=require("./app");



const port=process.env.PORT;

app.listen(port,()=>{
    console.log("server up "+port);
});
