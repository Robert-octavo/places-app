const express = require('express');
const { check } = require('express-validator');
const { getPlaceById, getPlacesByUserId, createPlace, updatePlaceById, deletePlaceById } = require('../controllers/places-controllers');

const router = express.Router(); // To register routes - can export this router to app.js

router.get('/:pid', getPlaceById);
router.get('/user/:uid', getPlacesByUserId);
router.post(
  '/', 
  [
    check('title').notEmpty(), 
    check('description').isLength({min: 5}),
    check('address').notEmpty()
  ], 
    createPlace
);
router.patch(
  '/:pid',
  [
    check('title').notEmpty(),
    check('description').isLength({min: 5})
  ],
  updatePlaceById);
router.delete('/:pid', deletePlaceById);

module.exports = router; // Export this router to app.js