//This adds express, bodyParser, request, and https to the project

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

const api_key = process.env.API_KEY;
const list_id = process.env.LIST_ID;

// This defines a constant named app that is an easier + standard way to write express()
const app = express();

//This makes it so that I can use the CSS and the images in my public folder.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

//This is the default page. It directs to the signup page.
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})

  // This is the post request. The submit button from the form directs to this request.
  // Using the form, it creates constants named firstName, lastName, and email where it stores
  // the data entered in the text boxes.
app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // This is mailchimp required code. This gives mailchimp the users email address,
  // first name, and last name to save in their API. It sets their status to subscribed.
  // All of this is stored in a constant named data.
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
  };
  // JSON.stringify is used to stringify the data (Javascript object) into a JSON string.
  const jsonData = JSON.stringify(data);

  // This url uses my List ID to create a new list in the Mailchimp account.
  // Documentation- https://mailchimp.com/developer/marketing/api/lists/add-list/
  const url = "https://us5.api.mailchimp.com/3.0/lists/" + list_id

  const options = {
    method: "POST",
    auth: "bhavyansh1:" + api_key
  }

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "failure.html")
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
});



// If the API request fails, it redirects the page to failure.html
app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on Port 3000");
})
