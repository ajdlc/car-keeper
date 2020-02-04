const express = require("express");
const router = new express.Router();
const Car = require("../models/car");
// Load in the auth
const auth = require("../middleware/auth");

// CREATE Car
router.post("/car", auth, async (req, res) => {
    const car = new Car({
        ...req.body, 
        owner: req.user_id
    });

    try {
        await car.save();
        res.status(201).send(car);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;