const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const auth = require("./Components/firebase-auth.js");

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.get("/api/getUser", (req, res) => {
  (async () => {
    let value = await api.getUser(USERNAME);
    console.log(value);
    res.send(value);
  })();
});

app.listen(port, () => console.log(`Listening on port ${port}`));






