const express = require("express");
const router = new express.Router();
const Car = require("../models/car");
const stats = require("simple-statistics");
// Load in the auth
const auth = require("../middleware/auth");

// CREATE Car
router.post("/cars", auth, async (req, res) => {
    const car = new Car({
        ...req.body, 
        owner: req.user._id
    });

    try {
        await car.save();
        res.status(201).send(car);
    } catch (e) {
        res.status(400).send(e);
    }
});

// READ Car
router.get("/cars", auth, async (req, res) => {
    try {
        const cars = await Car.find({ owner: req.user._id});

        if (!cars) {
            return res.status(404).send();
        }

        // Loop through the cars and sort the mpg entries by date
        cars.forEach(item => {
            // Sort the mpg Entries by date
            item.mpg.sort((a,b) => {
                if (a.date < b.date) {
                    return 1;
                } else if (a.date > b.date) {
                    return -1;
                }
                else {
                    return 0;
                }
            })
        })

        res.send(cars);
    } catch (e) {
        res.status(500).send(e);
    }
});

// READ Car by ID
router.get("/cars/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const car = await Car.findOne({_id, owner: req.user._id});

        if (!car) {
            return res.status(404).send();
        }

        // Sort the mpg Entries by date
        car.mpg.sort((a,b) => {
            if (a.date < b.date) {
                return 1;
            } else if (a.date > b.date) {
                return -1;
            }
            else {
                return 0;
            }
        })

        // Send the car back to the user
        res.send(car);
    } catch (e) {
        res.status(500).send(e);
    }
});

// READ average MPG
router.get("/cars/:id/avgMpg", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const car = await Car.findOne({_id, owner: req.user._id});

        if(!car) {
            return res.status(404).send();
        }

        // Perform the averaging
        let mpgVals = [];
        car.mpg.forEach(item => {
            mpgVals.push(item.mpg);
        })
        let avg = stats.mean(mpgVals);

        res.send({avg});
        
    } catch (e) {
        res.status(500).send(e);
    }
});

// READ Car stats - MPG, most used gas, most used gas station.
router.get("/cars/:id/stats", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const car = await Car.findOne({_id, owner: req.user._id});

        if(!car) {
            return res.status(404).send();
        }

        res.send({ msg: "ROUTE STILL WIP" });

        
    } catch (e) {
        res.status(500).send(e);
    }
})

// UPDATE Car 
router.patch("/cars/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "make", "model", "year", "mileage"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid operation"});
    }

    try {
        const car = await Car.findOne({ _id: req.params.id, owner: req.user._id });

        if (!car) {
            return res.status(404).send();
        }

        updates.forEach(update => {
            car[update] = req.body[update];
        })

        await car.save();
        res.send(car);
    } catch (e) {
        res.status(400).send(e);
    }
});

// DELETE car
router.delete("/cars/:id", auth, async (req, res) => {
    try {
        const car = await Car.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!car) {
            return res.status(404).send();
        }

        res.send(car);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;