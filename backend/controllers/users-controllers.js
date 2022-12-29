const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');

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

const getUsers = (req, res, next) => {
  res.json({ Users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find(u => u.email === email);
  if (hasUser) {
    throw new HttpError('Could not create user, email already exists.', 422);
  }
  const createdUser = {
    id: uuidv4(),
    name, // name: name,
    email, // email: email,
    password
  };
  DUMMY_USERS.push(createdUser);
  res.status(201).json({ User: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
  }
  res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;