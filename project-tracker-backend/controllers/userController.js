const User = require('../models/User');

// GET /api/users?username=foo or ?email=bar
exports.getUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.username) filter.username = req.query.username;
    if (req.query.email)    filter.email    = req.query.email;
    const users = await User.find(filter);
    res.json(users);
  } catch (err) {
    next(err);
  }
};
// controllers/userController.js

// GET /api/users?username=foo&email=bar
exports.getUsers = async (req, res, next) => {
  try {
    const { username, email } = req.query;
    let users;
    if (!username && !email) {
      // No filters → return all
      users = await User.find();
    } else {
      const filter = {};
      if (username) filter.username = username;
      if (email)    filter.email    = email;
      users = await User.find(filter);
    }
    res.json(users);
  } catch (err) {
    next(err);
  }
};
// GET /api/users?username=foo&email=bar
exports.getUsers = async (req, res, next) => {
    try {
      const { username, email } = req.query;
      const filter = {};
      if (username) filter.username = username;
      if (email)    filter.email    = email;
  
      // Always return 200, even if no filters or no matches
      const users = await User.find(filter);
      res.json(users);
    } catch (err) {
      next(err);
    }
  };

// POST /api/users
exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (await User.findOne({ username })) 
      return res.status(400).json({ message: 'Username exists' });
    if (await User.findOne({ email }))    
      return res.status(400).json({ message: 'Email in use' });

    const user = await User.create({ username, email, password });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};
