const mongoose = require("mongoose");

// Tasks Schema
const carSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    make: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isNumeric(value)) {
                throw new Error("Year value is not valid.");
            }
        }
    },
    mileage: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isNumeric(value, {no_symbols: true})) {
                throw new Error("Mileage is not in the correct format. Please do not use any commas, decimals, etc.");
            }
        }
    },
    mpg: [{
        entry: {
            type: Number,
            required: true,
            trim: true
        }
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;