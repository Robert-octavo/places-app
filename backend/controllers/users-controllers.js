const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const User = require('../models/user');

let DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Max Schwarz',
    email: 'example@example.com',
    password: 'test'
  },
  {
    id: 'u2',
    name: 'Robert Ortega',
    email: 'Test2@example.com',
    password: 'test'
  }
]

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password'); // -password => exclude the password field
    res.json({ users: users.map(user => user.toObject({ getters: true })) });
  } catch (err) {
    const error = new HttpError('Fetching users failed, please try again later.', 500);
    return next(error);
  }

  // res.json({ Users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('User exists already, please login instead.', 422);
    return next(error);
  }

  // const hasUser = DUMMY_USERS.find(u => u.email === email);
  // if (hasUser) {
  //   throw new HttpError('Could not create user, email already exists.', 422);
  // }

  // const createdUser = {
  //   id: uuidv4(),
  //   name, // name: name,
  //   email, // email: email,
  //   password
  // };
  // DUMMY_USERS.push(createdUser);

  const createdUser = new User({
    name,
    email,
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
    password,
    places: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ User: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  // const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  // if (!identifiedUser || identifiedUser.password !== password) {
  //   throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
  // }

  let existingUser;
  // validated email and password
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Logging in failed, please try again later.', 500);
    return next(error);
  }
  // check if user exists and password is correct
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError('Invalid credentials, could not log you in.', 401);
    return next(error);
  }

  res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;