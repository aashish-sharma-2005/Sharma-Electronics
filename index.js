//
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { encode } = require('punycode');
const con = require('./user');
// import getimgpath  from './public/css/home_cart';
// const user = require('./public/css/home_cart')
const route_fun = require('./constrol_user');
const cookieParser = require('cookie-parser');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Directory to save the file
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
    }
});
const upload = multer({ storage: storage });

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser());
app.set("view engine", "ejs");

app.use(session({
    secret: 'keyboard cat', // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600 * 60 * 24
    } // Set to true if using HTTPS
}));

app.get('/',route_fun.front)
app.get('/signup', route_fun.get_signup);
app.post('/signup', route_fun.post_signup);

app.get('/email-verification', route_fun.get_email_ver);
app.post('/email-verification', route_fun.post_email_ver);

app.get('/login',route_fun.get_login);
app.post('/login',route_fun.post_login);

app.get('/adminHome',route_fun.adminlogin,route_fun.get_adminData);
app.get('/home', route_fun.IsAuthenticate, route_fun.get_home);
app.get('/home/:id', route_fun.IsAuthenticate, route_fun.getdata);

app.get('/detail/:id', route_fun.IsAuthenticate, route_fun.admin_data)
app.get('/search',route_fun.IsAuthenticate,route_fun.search)
app.get('/aboutus',  route_fun.get_aboutus);
app.get('/contact-us', route_fun.get_contact);
app.get('/buy/:id', route_fun.IsAuthenticate, route_fun.buy_product);
app.post('/payment/:id', route_fun.IsAuthenticate, route_fun.payment);
app.get('/cart', route_fun.IsAuthenticate, route_fun.get_cart_data)
app.get('/cart/:id', route_fun.IsAuthenticate, route_fun.get_cart);
app.get('/deletecart/:id', route_fun.IsAuthenticate, route_fun.delete_cart);
app.put('/editItem', route_fun.put_Item);
app.get('/addItem', route_fun.get_addItem);
app.post('/addItem', upload.single('image'), route_fun.post_addItem);
app.get('/deleteHome/:id', route_fun.get_deleteItem)
app.get('/logout', route_fun.logout);

app.get('/forgototp',route_fun.get_forgot_otp);
app.post('/forgototp',route_fun.post_forgot_otp);
app.get('/forgot_email',route_fun.get_forgot);
app.post('/forgot_email',route_fun.post_forgot);
app.post('/newPassword',route_fun.new_password);

app.listen(8000, () => console.log("server started"));
