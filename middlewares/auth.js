const User = require("../models/db/user_model.js");
const ErrorHandler = require("../utils/error_handler.js");
const asyncHandler = require("../middlewares/async_handler.js");
const jwt = require("jsonwebtoken");

const authMiddleware = asyncHandler(async (req, res, next) => {
     const { token } = req.cookies;
     if (!token) return next(new ErrorHandler("Not authorized to access this route", 401));

     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     req.user = await User.findById(decoded.id);

     next();
});

const authRoles = ( ...roles ) => {
     return (req, res, next) => {
          if (!roles.includes(req.user.role)) {
               return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 403));
          };

          next();
     };
};

module.exports = { authMiddleware, authRoles };