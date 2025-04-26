// controllers/authController.js
const User = require('../models/User');

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: 'Incorrect password' });
    }
    // Remove password before sending back
    const u = user.toObject();
    delete u.password;
    res.json(u);
  } catch (err) {
    next(err);
  }
};
