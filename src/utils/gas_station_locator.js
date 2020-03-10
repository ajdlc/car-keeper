const request = require("request-promise-native");

// About 1600 m is 1 mi, so rounding up gives 2,000
// Actually switching it to 35 after doing some research
const radius = 100;
const type = "gas_station";

const getLocation = async (latitude, longitude) => {
    let results = [];

    const googleString = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_API}`;
    
    const res = JSON.parse(await request(googleString));
    console.log(res);
    

    // TODO: Need to check to see if the results yield nothing. Use the return from await request(googleString).status === "ZERO_RESULTS" to see if there are in fact 0 results

    // Get the first one
    // const data = {
    //     latitude: results.geometry.location.lat,
    //     longitude: results.geometry.location.lng,
    //     name: results.name,
    //     place_id: results.place_id,
    //     vicinity: results.vicinity
    // }

    // return data;

    // Commenting the above to deal with more than one result
    
    // Go through the response and build the appropriate formatted objects
    if (res.results.length > 0) {
        res.results.forEach(item => {
            results.push({
                latitude: item.geometry.location.lat,
                longitude: item.geometry.location.lng,
                name: item.name,
                place_id: item.place_id,
                vicinity: item.vicinity
            })
        })
        return results;
    } else {
        // Return false to show there was no gas station data found.
        return false;
    }
}

module.exports = {
    getLocation
}