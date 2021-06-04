//jshint esversion:6

const express = require("express");
const request = require("request");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");

//configuring the API
client.setConfig({
  apiKey: "d5cbe8b626d03cf150e72eaf71ca3170-us6",
  server: "us6",
});

const app = express();
app.use(express.static("public")); //so that html can access local static files
app.use(express.urlencoded({ extended: true })); //for body parser

app.post("/", function (req, res) {
  //collect the user data using body parser
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  const listId = "2e418ac9ad";

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  //add the memer to the list (in the Mailchimp server)
  function run() {
    client.lists
      .addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      })
      .then((response) => {
        res.sendFile(__dirname + "/success.html");
        console.log(
          `Successfully added contact as an audience member. 
            The contact's id is ${response.id}.`
        );
      })
      .catch((err) => {
        res.sendFile(__dirname + "/failure.html");
      });
  }
  run();
});

app.post("/failure",function(req,res){
  res.redirect("/");
})


app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});


//dynamic port that heroku will use, and we can also use on local system
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});

//API KEY: d5cbe8b626d03cf150e72eaf71ca3170-us6
//LIST ID: 2e418ac9ad
