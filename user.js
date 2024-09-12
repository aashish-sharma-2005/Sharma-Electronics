const mysql = require('mysql2');

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "project"
});

con.connect(function(err){
    if(err) console.log(err);
    else console.log("connected");
});

module.exports = con;
