var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'sql2.freesqldatabase.com',
    user: 'sql2387221',
    password: 'PictoHunt',
    database: 'sql2387221'
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");


    con.query("SELECT * FROM User;", function (err, result) {
        if (err) throw err;
        console.log(result);
    });
});
