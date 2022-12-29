const express = require('express');
const { getPlaceById, getPlacesByUserId, createPlace } = require('../controllers/places-controllers');

const router = express.Router(); // To register routes - can export this router to app.js

router.get('/:pid', getPlaceById);
router.get('/user/:uid', getPlacesByUserId);
router.post('/', createPlace);

module.exports = router; // Export this router to app.js