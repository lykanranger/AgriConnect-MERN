// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header ('Bearer TOKEN')
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from the token's ID and attach it to the request object
      // We exclude the password when fetching the user
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move on to the next function (the controller)
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };