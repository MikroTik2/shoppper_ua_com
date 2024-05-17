const express = require("express");
const router = express.Router();
const { authMiddleware, authRoles } = require('../middlewares/auth');
const { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct } = require("../controllers/product_controller");

router.post("/add", authMiddleware, authRoles('admin'), createProduct);

router.get("/all", getAllProducts);
router.get("/single/:id", getProduct);

router.put("/edit/:id", authMiddleware, authRoles('admin'), updateProduct);

router.delete("/delete/:id", authMiddleware, authRoles('admin'), deleteProduct);

module.exports = router;