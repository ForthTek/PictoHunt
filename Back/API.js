const admin = require("firebase-admin");
const auth = require("./serviceAccountKey.json");

module.exports = class API {
  constructor() {
    // Initialise the connection
    admin.initializeApp({
      credential: admin.credential.cert(auth),
    });

    // Reference to useful firebase stuff
    this.database = admin.firestore();
    this.storage = admin.storage();

    console.log("API connection created");
  }

  async browse() {
    const snapshot = await this.database.collection("Posts").get();
    let posts = [];

    // Check that there are posts
    if (snapshot._size > 0) {
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
    }

    return posts;
  }

  async map() {
    const snapshot = await this.database.collection("Posts").get();
    let posts = [];

    // Check that there are posts
    if (snapshot._size > 0) {
      snapshot.forEach((doc) => {
        // Return the data in a nice format
        let mapPost = {
          GPS: doc.data().GPS,
          icon: doc.data().photos[0],
          ID: doc.id,
        };

        posts.push(mapPost);
      });
    }

    return posts;
  }
};
