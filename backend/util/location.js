const API_KEY = 'AIzaSyAM1c-agoi8wR0Fgq6Mg78bmr7mCBU6Q3A'
const HttpError = require('../models/http-error');
const axios = require('axios');

async function getCoordsForAddress(address) {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);

  // https://maps.googleapis.com/maps/api/geocode/json?address=Washington&key=YOUR_API_KEY

  const data = await response.data;
  console.log(data);

  if (!data || data.status === 'ZERO_RESULTS') {
    throw new HttpError('Could not find location for the specified address.', 422);
  }

  const coordinates = data.results[0].geometry.location;
  return coordinates;
}

module.exports = getCoordsForAddress;