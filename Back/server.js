// Followed tutorial from:
// https://github.com/satansdeer/firebase-server-auth
// https://www.youtube.com/watch?v=kX8by4eCyG4

const bodyParser = require("body-parser");
const express = require("express");
const admin = require("firebase-admin");
const auth = require("./serviceAccountKey.json");

// Initialise the connection
admin.initializeApp({
  credential: admin.credential.cert(auth),
});

// Reference to useful firebase stuff
const db = admin.firestore();
const storage = admin.storage();

// Set up express
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/browse", function (req, res) {
  (async () => {
    const snapshot = await db.collection("Posts").get();

    // Check that there are posts
    if (snapshot._size > 0) {
      let posts = [];

      snapshot.forEach((doc) => {
        // Get the tag names from the references
        let tags = [];
        for (let i = 0; i < doc.data().tags.length; i++) {
          tags.push(doc.data().tags[i].id);
        }

        // Return the data in a nice format
        let post = {
          title: doc.data().title,
          GPS: doc.data().GPS,
          channel: doc.data().channel.id,
          tags: tags,
          photos: doc.data().photos,
          score: doc.data().score,
          user: doc.data().user.id,
          time: doc._createTime.toDate(),
          ID: doc.id,
        };

        posts.push(post);
      });

      console.log("/browse loaded the following posts from the database:");
      console.log(posts);
      res.send(posts);
    }
    // Send an error if there are no posts
    else {
      const error = "No posts to display";
      console.log(`ERROR: ${error}`);
      res.send({ error: error });
    }
  })();
});

app.get("/map", function (req, res) {
  (async () => {
    const snapshot = await db.collection("Posts").get();

    let posts = [];

    snapshot.forEach((doc) => {
      // Return the data in a nice format
      let mapPost = {
        GPS: doc.data().GPS,
        icon: doc.data().photos[0],
        ID: doc.id,
      };

      posts.push(mapPost);
    });

    console.log("/map loaded the following posts from the database:");
    console.log(posts);
    res.send(posts);
  })();
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
