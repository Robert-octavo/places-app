const express = require('express');
const userControllers = require('../controllers/users-controllers');

const router = express.Router();


router.get('/', userControllers.getUsers);
router.post('/signup', userControllers.signup);
router.post('/login', userControllers.login);
// router.get('/login/:username/:password', userControllers.getUserByUsernameAndPassword);

module.exports = router;