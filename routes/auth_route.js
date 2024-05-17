const express = require('express');
const { register, login, logout, resetPassword, forgotPassword } = require('../controllers/auth_controller.js');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

router.get("/logout", logout);

router.put("/password/reset/:token", resetPassword);

module.exports = router;