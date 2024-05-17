const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
     name: {
          type: String,
          required: [true, "Please enter your name"],
     },
     email: {
          type: String,
          required: [true, "Please enter your email"],
          unique: true,
     },
     password: {
          type: String,
          required: [true, "please enter your password"],
          minLength: [8, "password should have atleast 8 chars"],
          select: false,
     },

     role: {
          type: String,
          enum: ["user", "admin", "superadmin"],
          default: "user",
     },

     resetPasswordToken: String,
     resetPasswordExpire: Date,
});

userSchema.pre('save', async function(next) {
     if (!this.isModified("password")) {
          next();
     };

     this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function() {
     return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED });
};

userSchema.methods.comparePassword = async function(password) {
     return await bcrypt.compare(password, this.password);
};

userSchema.methods.getResetPasswordToken = async function() {
     const resetToken = crypto.randomBytes(20).toString("hex");

     this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
     this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

     return resetToken;
};

module.exports = mongoose.model('User', userSchema);