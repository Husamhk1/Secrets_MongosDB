//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const app = express();


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
        bcrypt.compare(password, user.password, function(err1, result) {
            // result == true
            if(result == true){
                console.log("Logged!");
                res.render("secrets");

            } else {
                console.log(err1);
            }           
            
        });
      }
         
    }).catch((err)=>{
        console.log(err);
        console.log("The Acount does't exist!");
    }) 

})

app.get("/register", async (req,res) =>{
    res.render("register")
});


app.post("/register",  (req, res)=>{


bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
        email: (req.body.username),
        password: hash
    });

    newUser.save().then(()=>{
        console.log("Saved!");
        res.render("secrets");
    }).catch((err)=>{
        console.log(err);
        console.log("Error");
    }) 
});


});

app.listen(3000 , function(){
    console.log("Serverstarted on port 3000.");
})
