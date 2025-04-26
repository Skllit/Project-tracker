
module.exports = (req, res, next) => {
    // (Assumes you have some auth middleware that attaches req.user)
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Admins only' });
  };
  