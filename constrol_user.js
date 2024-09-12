const con = require('./user');
const fs = require('fs');
const cookie_parser = require('cookie-parser');
const bcrypt = require('bcrypt');
const otp = require('./getOtp');
var f_otp = 0;
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const cookies = require('cookies');
const { query } = require('express');
const { type } = require('os');
const crypto = require('crypto');
const { log } = require('console');
const stripe = require('stripe')("sk_test_51PtOcwGIppfODu4WaSsxbhODPmnp6wqndVO5Z6IZW0JvMMa7zDwv3ORrYAGsOPf6JNfiEf1RBav0xnUv9pfcbyhw00p0oaHdpK")
var email = "";
var login = 1;
var data;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "aashishpandit2005@gmail.com",
        pass: "tiku ykzb erfi bcbz",
    },
});
class route_fun {
    static async get_home(req, res) {
        con.query('select * from image2', function (err, result) {
            if (err) console.log(err);
            if (result.length != 0) {
                const data = result;
                res.render('home', { data , name: req.session.email});
            }
        });
    }
    static async get_login(req, res) {
        res.render('login');
    }
    static async post_login(req, res) {
        const data = req.body;
        con.query(`select * from user where email='${data.email}'`, async function (err, result) {
            if (err) throw err;
            else {
                if (result) {
                    const user = result[0];
                    let isok = await bcrypt.compare(data.password, user.password);
                    if (isok) {
                        req.session.email = result[0].email;
                        // console.log(req.query.person);
                        if (req.query.person === "admin") {
                            req.session.secret = "9466117431";
                            res.redirect('/adminHome');
                        }
                        else if (req.query.person == "user") {
                            var token = jwt.sign(user, "shhhaaa", { expiresIn: '1h' });
                            res.cookie('token', token, { httpOnly: true })
                            res.redirect('/home');
                        }
                    }
                    else {
                        console.log("failed");
                        res.redirect('/login');
                    }
                }
                else {
                    res.send("data not found");
                }
            }
        })
    }
    static async get_signup(req, res) {
        res.render("signup");
    }
    static async post_signup(req, res) {
        data = req.body;
        transporter.sendMail({
            from: 'aashishpandit2005@gmail.com', // sender address
            to: "aashishpandit112@gmail.com", // list of receivers
            subject: "Electronic Store Otp", // Subject line
            html: "Your verification code is" + otp, // html body
        });
        console.log("signup otp send:- ",otp);
        res.redirect('/email-verification');
    }
    static async get_email_ver(req, res) {
        res.render("otp");
    }
    static async post_email_ver(req, res) {
        const data2 = req.body;
        if (data2.otp == otp) {
            const password = await bcrypt.hash(data.password, 10);
            con.query(`insert into user(name,address,email,password) values('${data.name}','${data.address}','${data.email}','${password}')`, function (err, result) {
            if (err) throw err;
            else {
                req.session.email = data.email;
                res.redirect('/login');
            }
        })
        }
        else{
            res.redirect('/signup');
        }
    }
    static async getdata(req, res) {
        const id = req.params.id;
        con.query(`select * from image2 where id=${id}`, function (err, result) {
            if (err) { throw err; }
            else {
                req.session.price = result[0].price;
                const data = result;
                res.render('details', { data });
            }
        })
    }
    static async get_aboutus(req, res) {
        res.render('aboutus');
    }
    static async get_contact(req, res) {
        res.render('follow');
    }
    static async buy_product(req, res) {
        const id = req.params.id;
        con.query(`select img,name,price from image where id = ${id}`, function (err, result) {
            if (err) { throw err; }
            else {
                const data = result;
                res.render('buy', { data });
            }
        });
    }
    static async payment(req, res) {
        const price = req.body.totalPrice;
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: "Sharma Electronic Store",
                            },
                            unit_amount: price * 100,
                        },
                        quantity: 1 // Add quantity if needed
                    }
                ],
                mode: 'payment', // Place mode property correctly inside the object 
                success_url: 'http://localhost:8000/home',
                cancel_url: 'http://localhost:8000/cancel'
            });
            const id = req.params.id;
            con.query(`delete from cart where id = ${id}`, function (err, result) {
                if (err) throw err;
                else {
                    // con.query(``)
                }
            })
            res.redirect(session.url)
        } catch (error) {
            console.error('Error creating checkout session:', error);
            res.status(500).json({ error: 'Failed to initiate checkout session' });
        }
    }
    static async get_cart(req, res) {
        const id = req.params.id;
        con.query(`select * from image where id = ${id}`, function (err, result) {
            if (err) { throw err; }
            else {
                var data = result[0];
                con.query(`select img from cart where img = '${data.img}'`, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    else {
                        const img = result[0];
                        if (img) {
                            res.send(`
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <title>Alert Example</title>
                                </head>
                                <body>
                                    <script>
                                        window.location.href = '/home/${id}'; // Redirect after alert
                                        alert('Already exists');
                                    </script>
                                </body>
                                </html>
                            `);
                        }
                        else {
                            con.query(`INSERT INTO cart(name,img,price,description,email) VALUES("${data.name}",'${data.img}',${data.price},"${data.description}",'${req.session.email}')`, function (err, result) {
                                if (err) throw err;
                                else {
                                    res.send(`
                                        <!DOCTYPE html>
                                        <html>
                                        <head>
                                            <title>Alert Example</title>
                                        </head>
                                        <body>
                                            <script>
                                                window.location.href = '/home/${id}'; // Redirect after alert
                                                alert('Added Successfuly');
                                            </script>
                                        </body>
                                        </html>
                                    `);
                                }
                            })
                        }
                    }
                })
            }
        })
    }
    static async delete_cart(req, res) {
        const id = req.params.id;
        con.query(`delete from cart where id = ${id}`, function (err, result) {
            if (err) throw err;
            else {
                res.redirect('/cart');
            }
        })
    }
    static async get_cart_data(req, res) {
        con.query(`select * from cart where email = '${req.session.email}'`, function (err, result) {
            if (err) throw err;
            else {
                const data = result;
                res.render('cart', { data });
            }
        })
    }
    static async IsAuthenticate(req, res,next) {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/login');
        }
        const user = jwt.verify(token, "shhhaaa");
        req.session.email = user.email;
        next();
    }
    static async get_adminData(req, res) {
        con.query('select * from image2', function (err, result) {
            if (err) console.log(err);
            if (result.length != 0) {
                const data = result;
                res.render('admin_home', { data });
            }
        });

    }
    static async adminlogin(req,res,next){
        if(req.session.secret=="9466117431"){
            next();
        }
        else{
            res.redirect('/login');
        }
    }
    static async logout(req, res) {
        login = 1;
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.redirect('/home'); // If there's an error, redirect to home or an error page
            }
            res.clearCookie('connect.sid'); // Assuming you're using the default session cookie
            res.redirect('/login'); // Redirect to the login page after logout
        });
    }
    static async put_Item(req, res) {

    }
    static async get_addItem(req, res) {
        res.render('addItem');
    }
    static async post_addItem(req, res) {
        const name = req.body.name;
        const file = req.body.image;
        const price = req.body.price;
        const description = req.body.description;
        const category = req.body.category;
        con.query(`insert into image2(name,img,price,description,category) values("${name}","${file}",${price},"${description}","${category}")`, function (err, result) {
            if (err) throw err;
            else {
                res.redirect('/adminHome');
            }
        })
    }
    static async get_deleteItem(req, res) {
        const id = req.params.id;
        con.query(`delete from image2 where id = ${id}`, function (err, result) {
            if (err) throw err;
            else {
                res.redirect('/adminHome');
            }
        })
    }
    static async search(req,res){
        const item = req.query.product;
        con.query(`SELECT * FROM image2 WHERE name LIKE '%${item}%'`,function(err,result){
            if(err) throw err;
            else{
                const data = result;
                if(data.length!=0){
                    res.render('searchItem',{data});
                }
                else{
                    res.send("Item not found");
                }
            }
        })
    }
    static async admin_data(req,res){
        const id = req.params.id;
        con.query(`select * from image where id=${id}`, function (err, result) {
            if (err) { throw err; }
            else {
                const data = result;
                res.render('detailsonly', { data });
            }
        })
    }
    static async get_forgot_otp(req,res){
        res.render('forgotOtp');
    }
    static async post_forgot_otp(req,res){
        const enterOtp = req.body.otp;
        if(enterOtp==f_otp){
            res.render('new_password');
        }
    }
    static async get_forgot(req,res){
        res.render('forgot_email');
    }
    static async post_forgot(req,res){
        const email = req.body.email;
        con.query(`select email from user where email = '${email}'`,function(err,result){
            if(err) throw err;
            else if(result.length==0){
                res.redirect('/forgot_email');
            }
            else{
                const crypto = require('crypto');
                const otp = crypto.randomInt(1111, 9999);
                // const otp = 1234;
                f_otp = otp;
                transporter.sendMail({
                    from: 'aashishpandit2005@gmail.com', // sender address
                    to: email, // list of receivers
                    subject: "Electronic Store Otp", // Subject line
                    html: "Your verification code is" + otp, // html body
                });
                console.log('otp sent:', otp);
                res.redirect('/forgototp');
            }
        })
    }
    static async new_password(req,res){
        const newp = req.body.confirmPassword;
        const p = await bcrypt.hash(newp,10);
        const query = 'UPDATE user SET password = ? WHERE email = ?';
        con.query(query, [p, email], (err, result) => {
            if (err) {
                console.error('Error updating password:', err);
            } else {
                res.redirect('/login');
            }
        });
        
    }
    static async front(req,res){
        res.render('frontPage');
    }
    static async iflogin(req,res){
        // try{
        //     jwt.verify(token, "shhhaaa", (err, decoded) => {
        //         if (err) {
        //             return res.redirect('/login');
        //         }
        //         req.user = decoded;
        //         next();
        //     });
        // }
        // catch{
        //     res.render('login');
        // }
    }
}
module.exports = route_fun;
