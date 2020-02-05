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

// READ mpg entry
router.get("/cars/:id/mpg/:mpgId", auth, async (req, res) => {
    try {
        const car = await Car.findOne({ _id: req.params.id, owner: req.user._id });

        if (!car) {
            return res.status(404).send();
        }

        const mpgEntry = car.mpg.find(entry => entry.id === req.params.mpgId);      

        if (mpgEntry.length === 0) {
            return res.status(404).send();
        }

        res.send(mpgEntry)
    } catch (e) {
        res.send(500).send();
    }

});

// READ MPG Entries
router.get("/cars/:id/mpg", auth, async (req, res) => {
    try {
        const car = await Car.findOne({ _id: req.params.id, owner: req.user._id });

        if (!car) {
            return res.status(404).send();
        }

        res.send(car.mpg);
    } catch (e) {
        res.status(500).send();
    }
});

// UPDATE MPG entry
router.patch("/cars/:id/mpg/:mpgId", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["miles", "gallons", "mpg", "location", "date"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid operation"});
    }

    try {
        const car = await Car.findOne({ _id: req.params.id, owner: req.user._id });

        if (!car) {
            return res.status(404).send();
        }

        // Get the index of the mpg entry we need
        const entryIndex = car.mpg.findIndex(entry => entry.id === req.params.mpgId);

        if (entryIndex === -1) {           
            return res.status(404).send();
        }

        updates.forEach(update => {
            car.mpg[entryIndex][update] = req.body[update];
        })

        // Determine if the MPG needs to be recalculated
        if ((updates.includes("miles") || updates.includes("gallons")) && !updates.includes("mpg")) {
            // Recalculate mpg
            car.mpg[entryIndex].mpg = (car.mpg[entryIndex].miles / car.mpg[entryIndex].gallons).toFixed(2);
        }

        // Determine if the date needs to be changed
        if (!updates.includes("date")) {
            car.mpg[entryIndex].date = car.mpg[entryIndex].date;
        } else {
            // Convert date
            car.mpg[entryIndex].date = new Date(req.body.date);
        }
        
        await car.save();
        res.send(car);
    } catch (e) {
        res.status(400).send(e);
    }
})

module.exports = router;