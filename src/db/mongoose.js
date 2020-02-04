const mongoose = require("mongoose");
const validator = require("validator");

// With mongoose, we place the database name inside of the connect function appending it to the address of the database.
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});