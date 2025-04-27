const jwt = require("jsonwebtoken");
const { CustomAPIError } = require("../errors/custom-error");
const User = require("../models/user");
const asyncWrap = require("../middlewares/asyncWrap");

const authenticate = asyncWrap(async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if(!token){
    throw new CustomAPIError("No token provided", 400);
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new CustomAPIError("User not found", 404);
  }

  req.user = user;
  next();
});

module.exports = authenticate;
