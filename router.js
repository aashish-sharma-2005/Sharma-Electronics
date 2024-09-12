const express = require('express');
const route = express.Router();
const route_fun = require('./constrol_user');

route.get('/signup',route_fun.get_signup);
route.post('/signup',route_fun.post_signup);

route.get('/email-verification',route_fun.get_email_ver);
route.post('/email-verification',route_fun.post_email_ver);

route.get('/login',route_fun.get_login);
route.post('/login',route_fun.post_login);

route.get('/home',route_fun.IsAuthenticate ,route_fun.get_home);
route.get('/home/:id',route_fun.IsAuthenticate ,route_fun.getdata);

route.get('/aboutus',route_fun.IsAuthenticate ,route_fun.get_aboutus);
route.get('/contact-us',route_fun.IsAuthenticate ,route_fun.get_contact);
route.get('/buy/:id',route_fun.IsAuthenticate ,route_fun.buy_product);
route.get('/payment',route_fun.IsAuthenticate ,route_fun.payment);
route.get('cart',route_fun.IsAuthenticate,route_fun.get_cart_data);
route.get('/cart/:id',route_fun.IsAuthenticate ,route_fun.get_cart);
route.get('/deletecart/:id',route_fun.IsAuthenticate ,route_fun.delete_cart);
route.get('/logout',route_fun.logout);

module.exports = route;