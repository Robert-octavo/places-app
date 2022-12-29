const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
  { 
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: 'u2'
  }
]

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }
  const place = DUMMY_PLACES.find(p => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError('Could not find a place for the provided id.', 404);
  }

  res.json({ Place: place }); // => { Place: { id: 'p1', title: 'Empire State Building', description: 'One of the most famous sky scrapers in the world!', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg', address: '20 W 34th St, New York, NY 10001', location: { lat: 40.7484405, lng: -73.9878584 }, creator: 'u1' } }
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid; // { uid: 'u1' }
  const place = DUMMY_PLACES.find(p => {
    return p.creator === userId;
  });

  if (!place) {
    const error = 'Could not find a place for the provided user id.';
    return next( new HttpError(error, 404));
  }

  res.json({ Place: place }); // => { Place: { id: 'p1', title: 'Empire State Building', description: 'One of the most famous sky scrapers in the world!', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg', address: '20 W 34th St, New York, NY 10001', location: { lat: 40.7484405, lng: -73.9878584 }, creator: 'u1' } }
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  DUMMY_PLACES.push(createdPlace); // Add to dummy data
  
  res.status(201).json({ Place: createdPlace }); // => { Place: { title: 'Empire State Building', description: 'One of the most famous sky scrapers in the world!', location: { lat: 40.7484405, lng: -73.9878584 }, address: '20 W 34th St, New York, NY 10001', creator: 'u1' } }
};


exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;