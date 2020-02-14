const request = require("request-promise-native");

// About 1600 m is 1 mi, so rounding up gives 2,000
// Actually switching it to 10
const radius = 100;
const type = "gas_station";

const getLocation = async (latitude, longitude) => {

    let googleString = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_API}`;
    

    console.log(await request(googleString));
    
    const results = JSON.parse(await request(googleString)).results[0];

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