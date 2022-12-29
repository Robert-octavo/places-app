const express = require('express');

const router = express.Router(); // To register routes - can export this router to app.js

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


router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }
  const place = DUMMY_PLACES.find(p => {
    return p.id === placeId;
  });
  res.json({ Place: place }); // => { Place: { id: 'p1', title: 'Empire State Building', description: 'One of the most famous sky scrapers in the world!', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg', address: '20 W 34th St, New York, NY 10001', location: { lat: 40.7484405, lng: -73.9878584 }, creator: 'u1' } }
});

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid; // { uid: 'u1' }
  const place = DUMMY_PLACES.find(p => {
    return p.creator === userId;
  });
  res.json({ Place: place }); // => { Place: { id: 'p1', title: 'Empire State Building', description: 'One of the most famous sky scrapers in the world!', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg', address: '20 W 34th St, New York, NY 10001', location: { lat: 40.7484405, lng: -73.9878584 }, creator: 'u1' } }
});

module.exports = router; // Export this router to app.js