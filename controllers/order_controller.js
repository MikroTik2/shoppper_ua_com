const asyncHandler = require("../middlewares/async_handler.js");
const ErrorHandler = require("../utils/error_handler.js");
const Order = require("../models/db/order_model.js");
const Product = require("../models/db/product_model.js");
const { startOfMonth, endOfMonth, subMonths } = require('date-fns');
const axios = require("axios");
const { MonoBankService } = require("../services/monobank.service.js"); 
const { LiqPayService } = require("../services/liqpay.service.js");
const monoBankService = new MonoBankService();
const liqpayService = new LiqPayService();

const createOrder = asyncHandler(async (req, res, next) => {

     const cart = req.cookies.cart || [];
     const total_price = req.cookies.total_price || 0;

     const order = await Order.create({
          firstname: req?.body?.firstname,
          lastname: req?.body?.lastname,
          mobile: req?.body?.mobile,
          email: req?.body?.email,
          region: req?.body?.region,
          department: req?.body?.department,
          items: cart.map(item => ({
               title: item.title,
               price: item.price,
               quantity: parseInt(item.quantity),
               priceTotal: item.priceTotal,
               image: item.image.url,
               product: item.product,
          })),
          total_price: total_price,
     });

     let response

     if (req?.body?.payment_methods === 'monobank') {

          response = await monoBankService.paymentPost(cart, total_price);

     } else {
          response = await liqpayService.paymentPost(cart, total_price, order);
     };

     for (const item of cart) {
          const product = await Product.findById(item.product);

          product.stock -= parseInt(item.quantity);
          product.salesStock += parseInt(item.quantity);

          await product.save();
     };

     res.clearCookie('cart');
     res.clearCookie('total_price');

     res.status(200).json({
          order: order,
          url: response.result.pageUrl || response.result.href,
     });
});

const getAllOrders = asyncHandler(async (req, res, next) => {
     const orders = await Order.find().lean();
     if (!orders) return next(new ErrorHandler("Заказ не найден"), 404);

     res.status(200).json({
          success: true,
          orders,
     });
});

const getOrder = asyncHandler(async (req, res, next) => {
     const order = await Order.findById(req.params.id).lean();
     if (!order) return next(new ErrorHandler(`Заказ ${req.params.id} не найден`), 404);

     res.status(200).json({
          success: true,
          order,
     });
});

const getOrdersCount = asyncHandler(async (req, res, next) => {
     
     const currentMonthSales = await Order.countDocuments({
          createdAt: { $gte: startOfMonth(new Date()), $lt: endOfMonth(new Date()) }
     });

     if (!currentMonthSales || currentMonthSales.length === 0) {
          return res.status(404).json({
               success: false,
               message: "Общий объем продаж за текущий месяц не найден"
          });
     };


     const prevMonthSales = await Order.countDocuments({
          createdAt: {
              $lt: new Date(),
              $gte: startOfMonth(subMonths(new Date(), 1))
          }
      });

     console.log(prevMonthSales);

     if (!prevMonthSales || prevMonthSales.length === 0) {
          return res.status(404).json({
               success: false,
               message: "Общий объем продаж за предыдущий месяц не найден"
          });
     };

     const percentChange = ((currentMonthSales - prevMonthSales) / prevMonthSales) * 100;

     res.status(200).json({
          success: true,
          orders: currentMonthSales,
          percent_change: percentChange.toFixed(2),
     });
});

const getTotalSales = asyncHandler(async (req, res, next) => {
     const currentMonthSales = await Order.aggregate([
          {
               $group: {
                    _id: null,
                    totalSales: { $sum: "$total_price" },
               },
          },
     ]);

     if (!currentMonthSales || currentMonthSales.length === 0) {
          return res.status(404).json({
               success: false,
               message: "Общий объем продаж за текущий месяц не найден"
          });
     };

     const prevMonthSales = await Order.aggregate([
          {
               $match: {
                    createdAt: { $lt: new Date(), $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
               }
          },
          {
               $group: {
                    _id: null,
                    totalSales: { $sum: "$total_price" },
               },
          },
     ]);

     if (!prevMonthSales || prevMonthSales.length === 0) {
          return res.status(404).json({
               success: false,
               message: "Общий объем продаж за предыдущий месяц не найден"
          });
     };

     const currentSales = currentMonthSales[0].totalSales;
     const prevSales = prevMonthSales[0].totalSales;
     const percentChange = ((currentSales - prevSales) / prevSales) * 100;

     res.status(200).json({
          success: true,
          total_sales: currentSales,
          percent_change: percentChange.toFixed(2),
     });
});

const deleteOrder = asyncHandler(async (req, res, next) => {
     const order = await Order.findByIdAndDelete(req.params.id).lean();
     if (!order) return next(new ErrorHandler(`Заказ ${req.params.id} не найден`), 404);

     res.status(200).json({
          success: true,
          order,
     });
});

module.exports = { 
     createOrder, 
     getAllOrders, 
     getOrder, 
     getOrdersCount, 
     getTotalSales, 
     deleteOrder,
};