const express = require("express");
const router = express.Router();
const { authMiddleware, authRoles } = require('../middlewares/auth');
const { createOrder, getAllOrders, getOrder, getOrdersCount, getTotalSales, deleteOrder } = require("../controllers/order_controller");

router.post('/payment', createOrder);

router.get("/all", getAllOrders);
router.get('/single/:id', authMiddleware, authRoles('admin'), getOrder);
router.get('/count', authMiddleware, authRoles('admin'), getOrdersCount);
router.get('/total-sales', authMiddleware, authRoles('admin'), getTotalSales);

router.delete('/delete/:id', authMiddleware, authRoles('admin'), deleteOrder);

module.exports = router;