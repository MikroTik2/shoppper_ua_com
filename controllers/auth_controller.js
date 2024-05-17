const User = require("../models/db/user_model.js");
const ErrorHandler = require("../utils/error_handler.js");
const asyncHandler = require("../middlewares/async_handler.js");
const sendEmail = require("../utils/send_email.js");
const sendToken = require("../utils/send_token.js");
const crypto = require("crypto");
const fs = require("fs");

const register = asyncHandler(async (req, res, next) => {
     const { name, email, password } = req.body;

     const user = await User.create({
          name,
          email,
          password,
     });

     sendToken(user, 201, res);
});

const login = asyncHandler(async (req, res) => {
     const { email, password } = req.body;
     if (!email || !password) return next(new ErrorHandler("Будь ласка, введіть електронну адресу та пароль", 400));

     const user = await User.findOne({ email }).select("+password");
     if (!user) return next(new ErrorHandler("Неправильна електронна адреса або пароль", 401));
     
     const isPasswordMatched = await user.comparePassword(password);
     if (!isPasswordMatched) return next(new ErrorHandler("Неправильна електронна адреса або пароль", 401));
     
     
     sendToken(user, 201, res);
});

const logout = asyncHandler(async (req, res, next) => {
     res.cookie("token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
     });

     res.status(200).json({
          success: true,
          message: "Logged Out",
     });
});

const forgotPassword = asyncHandler(async (req, res, next) => {

     const user = await User.findOne({ email: req.body.email });
     if(!user) return next(new ErrorHandler("Користувач не знайдений", 404));
 
     const resetToken = await user.getResetPasswordToken();
 
     await user.save({ validateBeforeSave: false });

     const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`;
     const template = fs.readFileSync('/Users/arturdocenko/Desktop/camera_ua_com/server/templates/forgot-password.html', 'utf8');
     const message = template.replace('{{ resetPasswordUrl }}', resetPasswordUrl);
     console.log(message);

     try {

          await sendEmail({
               email: user.email,
               subject: "Скинути пароль.",
               html: message,
          });

          res.status(200).json({
               success: true,
               message: `Лист успішно надіслано на адресу ${user.email}.`,
          });

     } catch (error) {

          user.resetPasswordExpire = undefined;
          user.resetPasswordToken = undefined;

          await user.save({ validateBeforeSave: false });

     };
});

const resetPassword = asyncHandler(async (req, res, next) => {

     const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

     const user = await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() },
     });

     if (!user) return next(new ErrorHandler("Неправильний токен скидання пароля", 404));

     user.password = req.body.password;
     user.resetPasswordToken = undefined;
     user.resetPasswordExpire = undefined;

     await user.save();
     sendToken(user, 201, res);
});

module.exports = {
     register,
     login,
     logout,
     forgotPassword,
     resetPassword,
};