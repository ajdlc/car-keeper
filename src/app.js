const express = require('express');
// const session = require("express-session");
require("./db/mongoose");
// Load the user router
const userRouter = require("./routers/user");
// Load the Car router
const carRouter = require("./routers/car");
// Load the MPG Router
const mpgRouter = require("./routers/mpg");

const app = express();

// Tell Express to automatically parse incoming JSON data to an object
app.use(express.json());

// Tell Express to use the session key
// app.use(session({secret: process.env.SESSION_KEY}));

// For CORS - Only when being used with development
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     if ("OPTIONS" == req.method) {
//         res.send();
//     } else {
//         next();
//     }
// });


// Use the user router
app.use(userRouter);
// Register the car router
app.use(carRouter);
// Register the MPG router
app.use(mpgRouter);




module.exports = app
