const express = require('express');
const router = express.Router();
const { createCart, getMeCart, deleteOneItemCart, clearCart, updateQuantityCart } = require('../controllers/user_controller');

router.post('/cart/add', createCart);

router.get("/cart/me", getMeCart);

router.put("/cart/quantity", updateQuantityCart);
router.put("/cart/clear", clearCart);
router.put("/cart/delete/:id", deleteOneItemCart);

module.exports = router;