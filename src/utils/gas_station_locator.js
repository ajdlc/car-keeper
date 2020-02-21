const request = require("request-promise-native");

// About 1600 m is 1 mi, so rounding up gives 2,000
// Actually switching it to 10
const radius = 25;
const type = "gas_station";

const getLocation = async (latitude, longitude) => {

    let googleString = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_API}`;
    

    console.log(await request(googleString));
    
    const results = JSON.parse(await request(googleString)).results[0];

    // TODO: Need to check to see if the results yield nothing. Use the return from await request(googleString).status === "ZERO_RESULTS" to see if there are in fact 0 results

    // Get the first one
    const data = {
        latitude: results.geometry.location.lat,
        longitude: results.geometry.location.lng,
        name: results.name,
        place_id: results.place_id,
        vicinity: results.vicinity
    }

    return data;
}

module.exports = {
    getLocation
}