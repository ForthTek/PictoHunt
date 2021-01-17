// Requiring modules 
const express = require('express');
const app = express();



// Get request 
app.get('/', function (req, res) {

    res.send("text");
});


var server = app.listen(5000, function () {
    console.log('Server is listening at port 5000...');
});

