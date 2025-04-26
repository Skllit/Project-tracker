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
