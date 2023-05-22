// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { options } = require("request");

const app = express();

app.use(express.static("public")); // making the none bootstrapped files static inside public folder

app.use(bodyParser.urlencoded({extended: true})); 

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html"); // signup.html is send to the website
});

app.post("/", function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    // to get the all info from the website 

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }; // data object in javascript form

    const jsondata =  JSON.stringify(data); // json format data wwhich is send to mailchimp

    const url = "https://us10.api.mailchimp.com/3.0/lists/5eb9361b25"; // us10 is used as the apikey has us10 at last and "5eb9...." is added at last which is list id which is added to the list api key of mailchimp 

    const options={
        method: "POST", 
        auth: "aayush1:a6e0338e5d20d068cfb4630cd3a014fc4-us10" // look documentation for option object
    }

    const request = https.request(url, options, function(response){
        // checking if statuscode = 200 then it means success or nothing is wrong so can be proceed else not.

        if (response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname +
                "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsondata); // this writes the jsondata into the mailchimp
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
}); // for redirecting to home page using try again button

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
}); // process.env.PORT will automatically fill up the port in which heroku will host


// API key
// c06a176942eebd070fdc6dca8b8b46cf-us10

// List ID
// 5eb9361b25


