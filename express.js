const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoStore = require("connect-mongo");
const mongoose = require('mongoose');
const cloudinary = require("cloudinary").v2;
require('dotenv').config();

const app = express();
const clientPromise = mongoose.connect(process.env.MONGO_URL);

// ROUTES
const authRoute = require("./routes/auth_route");
const userRoute = require("./routes/user_route");
const productRoute = require("./routes/product_route");
const orderRoute = require("./routes/order_route");
const newPostRoute = require("./routes/new-post_route");

// CLOUDINARY - SETUP
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// APP - SETUP
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// APP - SESSION
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
    cookie: { 
        sameSite: 'none',
        maxAge: 2 * 24 * 60 * 60 * 1000,
        domain: '.domain.com',
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        dbName: "camera",
        clientPromise,
        autoRemove: 'native',
        ttl: 14 * 24 * 60 * 60,
        autoRemoveInterval: 10,
    }),
}));

// APP - ROUTES
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/new-post", newPostRoute);

module.exports = app;