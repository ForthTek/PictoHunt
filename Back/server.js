// Followed tutorial from:
// https://github.com/satansdeer/firebase-server-auth
// https://www.youtube.com/watch?v=kX8by4eCyG4

const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const admin = require("firebase-admin");

const auth = require("./serviceAccountKey.json");

// Initialise the connection
admin.initializeApp({
  credential: admin.credential.cert(auth),
});

// Reference to the database
const db = admin.firestore();
const storage = admin.storage();

const PORT = process.env.PORT || 5000;
const app = express();

app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/browse", function (req, res) {
  (async () => {
    const snapshot = await db.collection("Posts").get();

    // Check that there are posts
    if (snapshot._size > 0) {
      let posts = [];

      snapshot.forEach(async (doc) => {
        // Get the tag names from the references
        let tags = [];
        for (let i = 0; i < doc.data().tags.length; i++) {
          tags.push(await doc.data().tags[i].id);
        }

        // Return the data in a nice format
        let post = {
          title: doc.data().title,
          GPS: doc.data().GPS,
          channel: await doc.data().channel.id,
          tags: tags,
          photos: await doc.data().photos,
          score: doc.data().score,
          user: await doc.data().user.id,
          time: doc._createTime.toDate(),
        };

        console.log("loaded post from the database:");
        console.log(post);
        res.send(post);
        //posts.push(post);
      });

      //console.log(posts);
      //res.send(all);
    }
    // Send an error if there are no posts
    else {
      const error = "No posts to display";
      console.log(`ERROR: ${error}`);
      res.send({ error: error });
    }
  })();
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
