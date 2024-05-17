const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
        title:{
                type:String,
                required:true,
        },
        slug: {
                type: String,
                required:true,
        },
        category: {
                type: String,
                required: true,
        },
        description:{
                type:String,
                required:true,
        },
        images: [{
                public_id: String,
                url: String,
        }],
        price: {
                type: Number,
                required: true,
                default: 0,
        },
        stock: {
                type: Number,
                required: true,
                default: 0,
        },
        salesStock: {
                type: Number,
                default: 0,  
        },
        numViews: {
                type: Number,
                default: 0,
        },
});

module.exports = mongoose.model('Product', productSchema);