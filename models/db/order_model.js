const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
     items: [{
          title: {
               type: String,
               required: true,
          },
          price: {
               type: Number,
               required: true,
          },
          priceTotal: {
               type: Number,
               required: true,
          },
          quantity: {
               type: Number,
               required: true,
          },
          image: {
               public_id: String,
               url: String,
          },

          product: {
               type: mongoose.Schema.ObjectId,
               ref: 'Product',
               required: true, 
          },
     }],

     payment_methods: {
          type: String,
          required: true,
          enum: ['monobank', 'privat24', 'cash'],
          default:'monobank',
     },

     firstname: {
          type: String,
          required: true,
     },
     lastname: {
          type: String,
          required: true,
     },
     mobile: {
          type: String,
          required: true,
     },
     email: {
          type: String,
          required: true,
     },
     region: {
          type: String,
          required: true,
     },
     department: {
          type: String,
          required: true,
     },
     total_price: {
          type: Number,
          required: true,
     },


}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);