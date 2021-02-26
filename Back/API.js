const admin = require("firebase-admin");
const auth = require("./serviceAccountKey.json");

module.exports = class API {
  #database;

  constructor() {
    // Initialise the connection
    admin.initializeApp({
      credential: admin.credential.cert(auth),
      // Storage at gs://picto-hunt.appspot.com
      storageBucket: "picto-hunt.appspot.com",
    });

    // Reference to useful firebase stuff
    this.#database = admin.firestore();

    console.log("API connection created");
  }

  #error(message) {
    return { error: message };
  }

  async browse() {
    const snapshot = await this.#database.collection("Posts").get();
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
    const snapshot = await this.#database.collection("Posts").get();
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

  async createPost(title, channelName, username, GPS, tags, photos) {
    /** Key for the new post */
    const ref = this.#database.collection("Posts").doc();
    const newKey = ref.id;
    console.log(newKey);
    // Maybe we could pass this to the front end so the post photos can be uploaded?

    const channelRef = this.#database.doc(`Channels/${channelName}`);
    await channelRef.get().then((docSnapshot) => {
      if (!docSnapshot.exists) {
        return this.#error(`Channel "${channelRef.path}" does not exist`);
      }
    });

    const userRef = this.#database.doc(`Users/${username}`);
    await userRef.get().then((docSnapshot) => {
      if (!docSnapshot.exists) {
        return this.#error(`User "${userRef.path}" does not exist`);
      }
    });

    // Tags should be refs as well

    // Do some input validation stuff here
    const postData = {
      title: title,
      GPS: GPS,
      channel: channelRef,
      tags: tags,
      photos: photos,
      score: 0,
      user: userRef,
    };

    // Write the post data to the database
    const x = await ref.set(postData);
    return x;
  }
};
