//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();


app.use(express.static("public"));
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
  }))

app.use(passport.initialize());
app.use(passport.session());

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

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);


app.get("/", function(req,res){
    res.render("home")
});


app.get("/login", function(req,res){
    res.render("login")
});

app.post("/login", (req,res)=>{
   

});

app.get("/register", async (req,res) =>{
    res.render("register")
});


app.post("/register",  (req, res)=>{



 
});

app.listen(3000 , function(){
    console.log("Serverstarted on port 3000.");
})
