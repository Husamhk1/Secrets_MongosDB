//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();
console.log(process.env.SECRET);

app.use(express.static("public"));
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/UserDB").then(()=>{
    console.log("connection successfully!")
}).catch((err)=>{
    console.log(err);
    console.log("ussuccessfull connection")
}) 

const userSchema = new mongoose.Schema({ 
    email:String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);



app.get("/", function(req,res){
    res.render("home")
});


app.get("/login", function(req,res){
    res.render("login")
});

app.post("/login", (req,res)=>{
   const username = req.body.username;
   const password = req.body.password;
   
    User.findOne({email:username}).then((user, err)=>{
      if(err){
        console.log(err);
      }else{

          if(user.password === password){
           
            console.log("Logged!");
            res.render("secrets");
        }
      
      }
      
      
    }).catch((err)=>{
        console.log(err);
        console.log("The Password is wrong");
    }) 

})

app.get("/register", async (req,res) =>{
    res.render("register")
});


app.post("/register",  (req, res)=>{
const newUser = new User({
    email: req.body.username,
    password: req.body.password
});
newUser.save().then(()=>{
    console.log("Saved!");
    res.render("secrets");
}).catch((err)=>{
    console.log(err);
    console.log("Error");
}) 

});

app.listen(3000 , function(){
    console.log("Serverstarted on port 3000.");
})
