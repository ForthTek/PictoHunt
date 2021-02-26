const bodyParser = require("body-parser");
const express = require("express");

const APIClass = require("./API.js");
const API = new APIClass();

// Set up express
const PORT = process.env.PORT || 5000;
const app = express();
// Apply express settings
app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Redirect / to browse screen
app.get("/", function (req, res) {
  res.redirect("/browse");
});

app.get("/browse", function (req, res) {
  (async () => {
    let posts = await API.browse();

    console.log("/browse loaded the following posts from the database:");
    console.log(posts);

    res.send(posts);
  })();
});

app.get("/map", function (req, res) {
  (async () => {
    let posts = await API.map();

    console.log("/map loaded the following posts from the database:");
    console.log(posts);

    res.send(posts);
  })();
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
