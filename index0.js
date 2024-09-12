//
const express = require('express');
const fs = require('fs');
const { encode } = require('punycode');
const con = require('./user');
// import getimgpath  from './public/css/home_cart';
const user = require('./public/css/home_cart')

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));
app.set("view engine","ejs");

app.get('/home',(req,res)=>{
     res.render("home");
     console.log(user.getimgpath);
})
app.get('/login',(req,res)=>{
     // fs.readFile("./public/html/login.ejs","utf-8",function(err,data){
     //      if(err) console.log(err);
     //      else res.write(data);
     // });
     res.render('login');
});
app.post('/login',(req,res)=>{
     console.log("in login");
     const data = req.body;
     console.log(data);
     res.redirect("/login");
})
app.get('/signup',(req,res)=>{
     // fs.readFile("./public/html/signup.ejs","utf-8",function(err,data){
     //      if(err) console.log(err);
     //      else res.write(data);
     // });
     res.render("signup");
})
app.post('/signup',(req,res)=>{
     // console.log("signup post");
     const data = req.body;
     console.log(data);
     res.redirect("/email-verification");
})
app.get('/email-verification',(req,res)=>{
     // fs.readFile("./public/html/otp.ejs","utf-8",function(err,data){
     //      if(err) console.log(err);
     //      else res.write(data);
     // })
     res.render("otp");
})
app.post('/email-verification',(req,res)=>{
     const data = req.body;
     console.log(data);
})

app.get('/cart',(req,res)=>{
     res.render("cart");
})


app.listen(8000,()=>console.log("server started"));
