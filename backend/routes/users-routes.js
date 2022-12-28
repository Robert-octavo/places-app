const express = require('express');

const router = express.Router();

router.get('/:userid', (req, res, next) => {
    res.json({ message: 'It works!' });
});

module.exports = router;