const express = require("express");
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");
// Load in user model
const User = require("../models/user");
// Get the custom express middleware for auth
const auth = require("../middleware/auth");
// Require the sendGrid custom file we made
const { sendWelcomeEmail, cancellationEmail } = require("../emails/account");

// User Creation Endpoint
router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
      await user.save();
      // Send the welcome email
      sendWelcomeEmail(user.email, user.name);
      // Generate token after user has been saved
      const token = await user.generateAuthToken();
      res.status(201).send({user, token});

    } catch (error) {
      res.status(400).send(error);
    }
});

// Logging in
router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        // Return jwt
        const token = await user.generateAuthToken();
        res.send({user, token})
    } catch (e) {
        res.status(400).send();
    }
});

// Logout User
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
          return token.token !== req.token;
        })
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

// Logout User (Remove All Tokens
router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

// Create a new instance of Multer
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        // Only allow jpg, jpeg, and png's
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload an image file: .jpg, .jpeg, .png"));
        }

        cb(undefined, true);
    }
});

// Upload avatar
router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    // Access the data through multer (can only access this field when we don't have the dest attribute specified on the multer object)
    // req.user.avatar = req.file.buffer;

    // Using Sharp
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;

    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

// Delete avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

// GET avatar
router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set("Content-Type", "image/png");
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

// Get Profile
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// Update user
router.patch("/users/me", auth, async (req, res) => {
  /**
   * This is to ensure that the user will receive an invalid operation error message when trying to update attributes that do not exist.
   */
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({error: "Invalid operation"});
  }
  
  try {

      updates.forEach(update => {
          req.user[update] = req.body[update];
      })

      await req.user.save();

      // Things went well
      res.send(req.user);
  } catch (e) {
      // If something goes wrong
      res.status(400).send(e);
  }
});

// Delete User
router.delete("/users/me", auth, async (req, res) => {
  try {
    //   const user = await User.findByIdAndDelete(req.user.id);
      // Send the welcome email
      cancellationEmail(req.user.email, req.user.name);
      await req.user.remove();

      res.send(req.user);
  } catch (e) {
      res.status(500).send();
  }
});

module.exports = router;