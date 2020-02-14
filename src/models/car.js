const mongoose = require("mongoose");
const validator = require("validator");

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
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isNumeric(value)) {
                throw new Error("Year value is not valid.");
            }
        }
    },
    vin: {
        type: String,
        required: true,
        trim: true
    },
    mileage: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isNumeric(value, {no_symbols: true})) {
                throw new Error("Mileage is not in the correct format. Please do not use any commas, decimals, etc.");
            }
        }
    },
    mpg: [{
        date: {
            type: Date,
            default: Date.now
        },
        miles: {
            type: Number,
            required: true,
            trim: true
        },
        gallons: {
            type: Number,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            trim: true
        },
        mpg: {
            type: Number
        },
        location: {
            latitude: {
                type: Number,
                trim: true
            },
            longitude: {
                type: Number,
                trim: true
            }
        },
        gasStation: {
            name: {
                type: String,
                trim: true
            },
            latitude: {
                type: Number
            },
            longitude: {
                type: Number
            },
            place_id: String,
            vicinity: String
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