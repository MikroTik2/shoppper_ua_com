const Product = require('../models/db/product_model');
const ErrorHandler = require('../utils/error_handler.js');
const asyncHandler = require('../middlewares/async_handler.js');
const cloudinary = require('cloudinary');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req, res) => {

        let images = [];

        if (typeof req.body.images === "string") {

                images.push(req.body.images);

        } else {
                images = req.body.images;
        };

        const imagesLink = [];

        for (let i = 0; i < images.length; i++) {

                const result = await cloudinary.v2.uploader.upload(images[i], {
                        folder: "products",
                        width: 345,
                        height: 430,
                        crop: 'fill',
                });
                
                imagesLink.push({
                        public_id: result.public_id,
                        url: result.secure_url,
                });
        };

        const product = await Product.create({
                title: req?.body?.title,
                description: req?.body?.description,
                slug: slugify(req?.body?.title),
                price: req?.body?.price,
                category: req?.body?.category,
                stock: req?.body?.stock,
                images: imagesLink,
        });

        res.status(201).json({
                success: true,
                product,
        });
});

const getAllProducts = asyncHandler(async (req, res) => {
        const products = await Product.find().sort({ numViews: -1 }).lean();
        if (!products) return next(new ErrorHandler("Товар не знайдено"), 404);

        res.status(200).json({
                success: true,
                products,
        });
});

const getProduct = asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id).lean();
        if (!product) return next(new ErrorHandler(`Продукт ${req.params.id} не знайдено`), 404);

        await Product.findByIdAndUpdate(req.params.id, {
                $inc: { numViews: 1 },
        });

        res.status(200).json({
                success: true,
                product,
        });
});

const updateProduct = asyncHandler(async (req, res) => {
        let images = [];

        if (typeof req.body.images === "string") {

                images.push(req.body.images);

        } else {
                images = req.body.images;
        };

        const imagesLink = [];

        for (let i = 0; i < images.length; i++) {

                const result = await cloudinary.v2.uploader.upload(images[i], {
                        folder: "products",
                        width: 345,
                        height: 430,
                        crop: 'fill',
                });
                
                imagesLink.push({
                        public_id: result.public_id,
                        url: result.secure_url,
                });
        };

        const product = await Product.findByIdAndUpdate(req.params.id, {
                title: req?.body?.title,
                description: req?.body?.description,
                slug: slugify(req?.body?.title),
                price: req?.body?.price,
                images: imagesLink,
                specs: req.body.specs,
                accessories: req.body.accessories
        }, { new: true });

        res.status(201).json({
                success: true,
                product,
        });
});

const deleteProduct = asyncHandler(async (req, res, next) => {
        const product = await Product.findById(req.params.id);
        if (!product) return next(new ErrorHandler(`Продукт ${req.params.id} не знайдено`), 404);
   
        const deleteImagePromises = product.images.map(async (image) => {
             await cloudinary.v2.uploader.destroy(image.public_id);
        });
   
        await Promise.all(deleteImagePromises);
        await Product.findByIdAndDelete(req.params.id);
        
        res.status(201).json({
             success: true,
             product,
        });
});

module.exports = {
        createProduct,
        getAllProducts,
        getProduct,
        updateProduct,
        deleteProduct,
};