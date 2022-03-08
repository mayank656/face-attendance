require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const {spawn} = require('child_process');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const id = "admin-shikhar";
const password = process.env.PASSWORD;
const database_url = "mongodb+srv://" + id + ":" + password + "@cluster0.gxjfw.mongodb.net/attendance";
mongoose.connect(database_url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    image: String
});
const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("dashboard");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    let userName = req.body.username;
    let passWord = req.body.password;

    User.findOne({username: userName}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                res.send("User already registered");
            } else {
                const user = new User({
                    username: userName,
                    password: passWord
                });
                user.save(function(){
                    res.send("User has been registered");
                });
            }
        }
    });
});

app.get('/python', (req, res) => {
 
    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python', ['test.py']);
    // collect data from script
    python.stdout.on('data', function (data) {
     console.log('Pipe data from python script ...');
     dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(dataToSend)
    });
    
   })

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(req, res){
    console.log("Server is running on PORT 3000");
});