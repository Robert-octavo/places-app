const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

let DUMMY_PLACES = [
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

const getPlaceById =async (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }
  // const place = DUMMY_PLACES.find(p => {
  //   return p.id === placeId;
  // });
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find a place.', 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find a place for the provided id.', 404);
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) }); // getters: true => to get the id instead of _id
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid; // { uid: 'u1' }

  // const places = DUMMY_PLACES.filter(p => {
  //   return p.creator === userId;
  // });

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find places.', 500);
    return next(error);
  }

  if (!places || places.length === 0) {
    const error = 'Could not find places for the provided user id.';
    return next( new HttpError(error, 404));
  }

  res.json({ places: places.map(place => place.toObject({ getters: true })) }); 
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  // const createdPlace = {
  //   id: uuidv4(),
  //   title,
  //   description,
  //   location: coordinates,
  //   address,
  //   creator
  // };

  // DUMMY_PLACES.push(createdPlace); // Add to dummy data
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
    creator
  });

  let user;
  // find the user who created the place
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again.', 500);
    return next(error);
  }

  // check if the user exists
  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }


  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
    // await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ Place: createdPlace }); // => { Place: { title: 'Empire State Building', description: 'One of the most famous sky scrapers in the world!', location: { lat: 40.7484405, lng: -73.9878584 }, address: '20 W 34th St, New York, NY 10001', creator: 'u1' } }
};

const updatePlaceById = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;
  // const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };
  // const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;
  // updatedPlace.title = title;
  // updatedPlace.description = description;
  // DUMMY_PLACES[placeIndex] = updatedPlace;
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );  
    return next(error);
  }
  
  try {
    await place.remove();
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    // await place.remove({ session: sess });
    // place.creator.places.pull(place);
    // await place.creator.save({ session: sess });
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  // if (!DUMMY_PLACES.find(p => p.id === placeId)) {
  //   throw new HttpError('Could not find a place for that id.', 404);
  // }

  // DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId); // Filter out the place with the id that matches the placeId param in the request url (pid) and reassign the DUMMY_PLACES array to the new array that is returned from the filter method (which is all the places that do not have the id that matches the placeId param in the request url (pid))
  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;