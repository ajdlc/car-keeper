const express = require('express');
require("./db/mongoose");
// Load the user router
const userRouter = require("./routers/user");
// Load the Car router
const carRouter = require("./routers/car");

const app = express();

// Tell Express to automatically parse incoming JSON data to an object
app.use(express.json());
// Use the user router
app.use(userRouter);
// Register the car router
app.use(carRouter);


module.exports = app
