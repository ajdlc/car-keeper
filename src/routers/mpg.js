const express = require("express");
const router = new express.Router();
const Car = require("../models/car");
// Load in the auth
const auth = require("../middleware/auth");

// CREATE mpg entry
router.post("/cars/:id/mpg", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["miles", "gallons", "mpg", "location"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid operation"});
    }

    // Get the mpg
    const entry = {...req.body};

    // Determine if the mpg was provided
    if (!entry.mpg) {
        entry.mpg = (entry.miles / entry.gallons);
        entry.mpg = entry.mpg.toFixed(2);
    }

    const car = await Car.findOne({_id: req.params.id, owner: req.user._id});

    if (!car) {
        return res.status(404).send();
    }

    car.mpg.push(entry);

    try {
        await car.save();
        res.send(car);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;