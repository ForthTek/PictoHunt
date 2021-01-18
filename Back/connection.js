var sql = require('mysql');

var con = sql.createConnection({
    host: 'sql2.freesqldatabase.com',
    user: 'sql2387221',
    password: 'PictoHunt',
    database: 'sql2387221'
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");


    /*
    con.query("SELECT * FROM User;", function (err, result) {
        if (err) throw err;
        console.log(result);
    });
    */

   let request = connection.Request();

   request.query("SELECT * FROM User;", function (err, data) {

       if (err) throw err;

       console.log(data);
       return data;
   });
    
    //console.log(query(con, "SELECT * FROM User;"));


});

function query(connection, query) {
    let request = connection.Request();

    request.query(query, function (err, data) {

        if (err) throw err;

        console.log(data);
        return data;
    });
}

function query(connection, query, values) {

    connection.query(query, values, function (error, result) {
        if (error) {
            throw error;
        }
        else {
            return result;
        }
    });

}


/*
function query(query, bindings) {
    let preparedStatement = new sql.preparedStatement();
    preparedStatement.bindings = bindings;

    preparedStatement.prepare(query).then(function () {
        return preparedStatement.execute
    });


}


function authenticate(req, res, next) {
    const username = req.query.username, password = req.query.password;
    let preparedStatement = new sql.PreparedStatment(),
        sqlQuery = "select * from users where (username = @username and password = @password)";

    preparedStatement.input('username', sqlVarChar(50))
    preparedStatement.input('password', sqlVarChar(50))
    preparedStatement.prepare(sqlQuery)
        .then(function () {
            return preparedStatement.execute({ username: username, password: password })
                .then(function (recordset) {
                    if (recordset.length == 1) {
                        loggedIn = true
                        //successful log in
                    } else {
                        //authentication failed
                    }
                })
        })
        .catch(next)
}

*/
