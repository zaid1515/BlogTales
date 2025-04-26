const { CustomAPIError } = require("../errors/custom-error");

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new CustomAPIError("Unauthorized to access this route", 403);
    }
    next();
  };
};

module.exports = authorizeRole;
