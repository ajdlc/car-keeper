const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Used to delete the Cars when the user is delted
const Car = require("./car");

// Create the Schema
const userSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (validator.contains(value.toLowerCase(), "password")) {
        throw new Error("This password cannot contain \"password\"");
      }
    }
  },  
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    // Custom validator using the validator package
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      require: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
});

// Setup the virtual property to tell Mongoose that user has car
userSchema.virtual("car", {
  ref: "Car",
  localField: "_id",
  foreignField: "owner"
});



// To generate tokens
userSchema.methods.generateAuthToken = async function () {
  // Allows us to use the variable user instead of this.
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  // Add it to the users document
  user.tokens = user.tokens.concat({ token });
  await user.save();
  
  return token;

};

// Switching this to utilize the toJSON method
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  // Delete those off of the object.
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
}

// Setting up a function that allows us to access it when we have access to the model.
userSchema.statics.findByCredentials = async (email, password) => {
  // Find by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  // Verify the password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
}

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  // next() needs to be called to tell Mongoose to save the user
  next();
})

// Middleware - Delete user Cars when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Car.deleteMany({ owner: user._id });

  next();
})

// User model
const User = mongoose.model("User", userSchema);

module.exports = User;