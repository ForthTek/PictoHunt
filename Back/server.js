// Followed tutorial from:
// https://github.com/satansdeer/firebase-server-auth
// https://www.youtube.com/watch?v=kX8by4eCyG4

const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const admin = require("firebase-admin");

const auth = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(auth),
  /** FIND DB URL */
  //databaseURL: "https://server-auth-41acc.firebaseio.com",
});

const csrfMiddleware = csrf({ cookie: true });

const PORT = process.env.PORT || 5000;
const app = express();

app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));

/** DO WE NEED THIS? */
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

app.get("/login", function (req, res) {
  res.render("login.html");
});

app.get("/signup", function (req, res) {
  res.render("signup.html");
});

app.get("/profile", function (req, res) {
  const sessionCookie = req.cookies.session || "";

  // Check that the user has the required session cookie
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
      res.render("profile.html");
    })
    // If not, force them to login
    .catch((error) => {
      res.redirect("/login");
    });
});

app.get("/", function (req, res) {
  res.redirect("/browse");
});

app.get("/browse", function (req, res) {
  // Home screen
});

app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  // Cookie expires in 5 days
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    // Create the session cookie for the user
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/login");
});

/** TODO */
app.get("/api/getUser", (req, res) => {
  (async () => {
    let value = await api.getUser(USERNAME);
    console.log(value);
    res.send(value);
  })();
});


app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
