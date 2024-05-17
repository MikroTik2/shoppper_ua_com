const Product = require('../models/db/product_model');
const ErrorHandler = require('../utils/error_handler.js');
const asyncHandler = require('../middlewares/async_handler.js');
const cloudinary = require('cloudinary');

const createCart = asyncHandler(async (req, res, next) => {
     const { cart } = req.body;
 
     let userCart = req.cookies.cart || [];

     for (let i = 0; i < cart.length; i++) {
          const product = await Product.findById(cart[i].product).select('price images title').exec();
          if (!product) return next(new ErrorHandler(`Товар ${cart[i].product} не знайдено`));

          const existingCartItemIndex = userCart.findIndex(item => item.product.toString() === product._id.toString());

          if (existingCartItemIndex !== -1) {

               if (userCart[existingCartItemIndex].quantity + cart[i].quantity > 10) {
                    return next(new ErrorHandler(`Ви не можете замовити понад 10 одиниць товару ${product.title}`), 400);
               };

               userCart[existingCartItemIndex].quantity += cart[i].quantity;
               userCart[existingCartItemIndex].priceTotal = product.price * userCart[existingCartItemIndex].quantity;
          } else {
               const cartItem = {
                    product: product._id,
                    title: product.title,
                    image: product.images[0],
                    quantity: cart[i].quantity,
                    priceTotal: product.price * cart[i].quantity,
                    price: product.price,
               };

                     
               userCart.push(cartItem);
          };
     };

     const total_price = calculateCartTotal(userCart);

     res.cookie('total_price', total_price, { maxAge: 2 * 60 * 60 * 1000 });
     res.cookie('cart', userCart, { maxAge: 2 * 60 * 60 * 1000 });

     res.json({
          success: true, 
          cart: userCart, 
          total_price,
     });
});

const getMeCart = asyncHandler(async (req, res) => {
     const cart = req.cookies.cart || [];
     const total_price = req.cookies.total_price || 0;
     
     res.status(200).json({ success: true, cart, total_price: parseInt(total_price) });
});

const updateQuantityCart = asyncHandler(async (req, res, next) => {
     let cart = req.cookies.cart || [];
     
     const productId = req.query.productId;
     const quantity = parseInt(req.query.quantity);
 
     const index = cart.findIndex(item => item.product.toString() === productId);
 
     if (index === -1) {
          return next(new ErrorHandler(`Продукт ${productId} не знайдено в кошику`), 404);
     };
 
     cart[index].quantity = quantity;
     cart[index].priceTotal = cart[index].price * quantity;
 
     const total_price = calculateCartTotal(cart);
 
     res.cookie('total_price', total_price, { maxAge: 2 * 60 * 60 * 1000 });
     res.cookie('cart', cart, { maxAge: 2 * 60 * 60 * 1000 });
 
     res.json({
          success: true,
          cart,
          total_price,
     });
});

const clearCart = asyncHandler(async (req, res, next) => {
     res.clearCookie('cart');
     res.clearCookie('total_price');
     res.json({
          success: true,
          message: 'Кошик успішно очищено',
     });
});

const deleteOneItemCart = asyncHandler(async (req, res, next) => {
     let cart = req.cookies.cart || [];

     cart = cart.filter(item => item.product !== req.params.id);

     const subtotal = calculateCartTotal(cart);
     total_price = parseInt(subtotal);

     res.cookie('total_price', total_price, { maxAge: 24 * 60 * 60 * 1000 });
     res.cookie('cart', cart, { maxAge: 24 * 60 * 60 * 1000 });

     res.json({
          success: true,
          cart,
          total_price,
     });
});

const calculateCartTotal = (cart) => {
     return cart.reduce((total, item) => total + item.priceTotal, 0);
};

module.exports = {
     createCart,
     getMeCart,
     updateQuantityCart,
     clearCart,
     deleteOneItemCart,
};