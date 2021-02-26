const admin = require("firebase-admin");
const auth = require("./serviceAccountKey.json");

module.exports = class API {
  #database;
  #storage;

  constructor() {
    // Initialise the connection
    admin.initializeApp({
      credential: admin.credential.cert(auth),
      // Storage at gs://picto-hunt.appspot.com
      storageBucket: "picto-hunt.appspot.com",
    });

    // Reference to useful firebase stuff
    this.#database = admin.firestore();
    this.#storage = admin.storage();

    console.log("API connection created");

    // Create a new random key
    const newReference = this.#database.collection("Posts").doc();
    this.#uploadImage(newReference.id, 0, "./dog1.jpg");
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

  async createPost(title, channel, user, GPS, tags, photos) {
    // Do some input validation stuff here
    const postData = {
      title: title,
      //GPS: doc.data().GPS,
      channel: channel,
      tags: tags,
      photos: photos,
      score: 0,
      user: user,
      //time: ,
      //ID: ,
    };

    /** Key for the new post */
    const newKey = this.#database.collection("Posts").push().key;

    // Now upload the images

    var updates = {};
    // Write the post data to the database
    updates[`/Posts/${newKey}`] = postData;

    // Update the database now
    const x = this.#database.update(updates);
  }

  async #uploadImage(newPostName, positionInPost, localPath) {
    const ref = this.#storage.child(`/Posts/${newPostName}/${positionInPost}}`);

    // Don't use this for now
    const metadata = {
      contentType: "image/jpeg",
    };

    // Upload the file
    var uploadTask = ref.put(localPath);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
    );
  }
};
