require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const {spawn} = require('child_process');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(
    session({
        secret: "Our little secret.",
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

const saltRounds = 10;

const id = "admin-shikhar";
const password = process.env.PASSWORD;
const database_url = "mongodb://127.0.0.1:27017/attendance";
mongoose.connect(database_url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
    userid: String,
    username: String,
    name: String,
    address: String,
    mobile: Number,
    age: Number
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.get("/", function(req, res){
    res.render("dashboard");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/dashboard", function(req, res){
    res.render("dashboard");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.post("/register", function (req, res) {
    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python', ['register.py', req.body.userid]);
    // collect data from script
    python.stdout.on('data', function (data) {
     console.log('Pipe data from python script ...');
     dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    });

    User.register(
        {
            userid: req.body.userid,
            username: req.body.username,
            name: req.body.name,
            address: req.body.address,
            mobile: req.body.mobile,
            age: req.body.age
        },
        req.body.password,
        function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/dashboard");
                });
            }
        }
    );
});

app.get("/python", (req, res) => {
 
    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python', ['attendance.py']);
    // collect data from script
    python.stdout.on('data', function (data) {
     console.log('Pipe data from python script ...');
     dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    res.redirect("/dashboard");
    // send data to browser
    });
    
   })

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(req, res){
    console.log("Server is running on PORT 3000");
});