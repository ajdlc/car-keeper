const express = require("express");
const router = new express.Router();
// Load in the auth
const auth = require("../middleware/auth");
// Load in the getLocation Google Maps API
const gasStationLocator = require("../utils/gas_station_locator");

// GET Location
router.post("/location", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["location"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid operation" });
    }

    let loc = req.body.location;
    console.log(loc);
    

    // Determine if the location was provided
    if (!loc.latitude || !loc.longitude) {
        return res.status(404).send({error: "Please provide latitude and longitude"});
    }

    // Get the gas station information
    const gasStation = await gasStationLocator.getLocation(loc.latitude, loc.longitude);
    console.log(gasStation);
    

    // If no gas station was found
    if (!gasStation) {
        return res.status(404).send("No gas stations found");
    }

    return res.send(gasStation);
})

module.exports = router;