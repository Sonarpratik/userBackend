const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookie = require('cookie-parser')


const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;


const cors = require("cors")
app.use(cors());

app.use(cookie())

//Connection is achieved
require('./db/conn')

//to understand json file
app.use(express.json());

//We connect to the router to free the space in app js
app.use(require('./router/auth'))


//MiddleWare
// const middleware = (req, res, next) => {
//   console.log("Hello my widdle ware");
//   next();
// };



// app.get("/", (req, res) => {
//   res.send("hello world");
// });

// app.get("/about", middleware, (req, res) => {
//   res.send("hello about");
// });
app.get("/contact", (req, res) => {
  res.cookie("jwt_token","okya its tes");
  res.send("hello contact");
});
app.get("*", (req, res) => {
  res.send("hello hahaha ur wrong");
});

app.listen(PORT, () => {
  console.log(`server is running on port no ${PORT}`);
});
