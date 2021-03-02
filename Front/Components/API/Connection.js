import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyCvQv_waR8vtFZIrmHlgVexp0VrrGNwGBE",
  authDomain: "picto-hunt.firebaseapp.com",
  projectId: "picto-hunt",
  storageBucket: "picto-hunt.appspot.com",
  messagingSenderId: "762056308518",
  appId: "1:762056308518:web:ec820ae748f1191699b3e7",
  measurementId: "G-HDTRBXWKV1",
};

export default class Connection {
  database;
  auth;
  storage;

  constructor() {
    // Initialise the connection
    firebase.initializeApp(config);

    //this.storage = firebase.storage();
    this.database = firebase.firestore();
    this.auth = firebase.auth();

    console.log("*Created connection to Firebase");
  }

  close() {
    //firebase.off();
    console.log("*Closed connection to Firebase");
  }

  error(message) {
    return { error: message };
  }

  async login(email, password) {
    let success, error;

    await this.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        success = true;
      })
      .catch((err) => {
        success = false;
        error = err.message;
      });

    // return the success status for tests and error message if there is one
    return { success: success, error: error };
  }

  // Use this for personalisation
  //   var user = firebase.auth().currentUser;

  // if (user) {
  //   // User is signed in.
  // } else {
  //   // No user is signed in.
  // }

  // if (user != null) {
  //   name = user.displayName;
  //   email = user.email;
  //   photoUrl = user.photoURL;
  //   emailVerified = user.emailVerified;
  //   uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
  //                    // this value to authenticate with your backend server, if
  //                    // you have one. Use User.getToken() instead.
  // }

  returnPost(doc) {
    const data = doc.data();

    // Get the tag names from the references
    let tags = [];
    for (let i = 0; i < data.tags.length; i++) {
      tags.push(data.tags[i].id);
    }

    // Return the data in a nice format
    let post = {
      title: data.title,
      GPS: data.GPS,
      channel: data.channel.id,
      tags: tags,
      photos: data.photos,
      score: data.score,
      user: data.user.id,
      //time: doc._createTime.toDate(),
      ID: doc.id,
    };

    return post;
  }

  async getAllPosts() {
    let posts = [];

    await this.database
      .collection("Posts")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          posts.push(this.returnPost(doc));
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    return posts;
  }

  async getBrowse() {
    const snapshot = await this.database.collection("Posts").get();
    let posts = [];

    // Check that there are posts
    if (snapshot._size > 0) {
      snapshot.forEach((doc) => {
        posts.push(this.returnPost(doc));
      });
    }

    return posts;
  }

  async getMap() {
    const snapshot = await this.database
      .collection("Posts")
      .where("GPS", "!=", null)
      .get();
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

  /**
   *
   * @param {string} username
   * @param {boolean} loadFollowedFeeds
   */
  async getProfile(username, loadFollowedFeeds = true) {
    // Get the user with username
    const userRef = this.database.doc(`Users/${username}`);
    const userData = await userRef.get();

    // Process the data
    if (userData.exists) {
      const data = userData.data();

      let users;
      let channels;
      let tags;

      // Only load the followed channels/tags/users if we need to
      if (loadFollowedFeeds) {
        users = [];
        channels = [];
        tags = [];

        for (let i = 0; i < data.followedUsers.length; i++) {
          users.push(data.followedUsers[i].id);
        }
        for (let i = 0; i < data.followedChannels.length; i++) {
          channels.push(data.followedChannels[i].id);
        }
        for (let i = 0; i < data.followedTags.length; i++) {
          tags.push(data.followedTags[i].id);
        }
      }

      let user = {
        username: username,
        email: data.email,
        public: data.public,
        score: data.score,
        createdProfile: userData._createTime,
        totalUsersFollowing: data.followedUsers.length,
        totalChannelsFollowing: data.followedChannels.length,
        totalTagsFollowing: data.followedTags.length,
        loadedFollowedFeeds: loadFollowedFeeds,
        followedUsers: users,
        followedChannels: channels,
        followedTags: tags,
      };

      return user;
    }
    // Throw an error if the user does not exist
    else {
      return this.error(`User "${userRef.path}" does not exist`);
    }
  }

  /**
   *
   * @param {string} title
   * @param {string} channelName
   * @param {string} username
   * @param {GeoPoint} GPS
   * @param {string[]} tags
   * @param {string[]} photos
   */
  async createPost(title, channelName, username, GPS, tags, photos) {
    /** Key for the new post */
    const ref = this.database.collection("Posts").doc();
    const newKey = ref.id;

    //console.log(newKey);
    // Maybe we could pass this to the front end so the post photos can be uploaded?

    // Get a reference to the user posting this
    const userRef = this.database.doc(`Users/${username}`);
    // Throw an error if it does not exist
    if (!(await userRef.get()).exists) {
      return this.error(`User "${userRef.path}" does not exist`);
    }

    // Get a reference to the channel
    const channelRef = this.database.doc(`Channels/${channelName}`);
    // Throw an error if it does not exist
    if (!(await channelRef.get()).exists) {
      return this.error(`Channel "${channelRef.path}" does not exist`);
    }

    // Get refs to all the tags
    let tagRefs = [];
    for (let i = 0; i < tags.length; i++) {
      const tagRef = this.database.doc(`Tags/${tags[i]}`);
      // Throw an error if it does not exist
      if (!(await tagRef.get()).exists) {
        return this.error(`Tag "${tagRef.path}" does not exist`);
      } else {
        tagRefs.push(tagRef);
      }
    }

    // Do some input validation stuff here
    const postData = {
      title: title,
      GPS: GPS,
      channel: channelRef,
      tags: tagRefs,
      photos: photos,
      score: 0,
      user: userRef,
    };

    // Write the post data to the database
    const x = await ref.set(postData);
    return x;
  }

  async createTag(name, description, icon, similarTags = []) {
    const ref = this.database.doc(`Tags/${name}`);

    // Tag already exists
    if ((await ref.get()).exists) {
      return this.error(`Tag "${ref.path}" already exists`);
    }
    // Otherwise, create the tag
    else {
      let similarTagRefs = [];
      for (let i = 0; i < similarTags.length; i++) {
        const similarRef = this.database.doc(`Tags/${similarTags[i]}`);

        // Tag already exists
        if (!(await similarRef.get()).exists) {
          return this.error(`Tag "${similarRef.path}" does not exist`);
        } else {
          similarTagRefs.push(similarRef);
        }
      }

      const tag = {
        description: description,
        icon: icon,
        similarTags: similarTagRefs,
      };

      return await ref.set(tag);
    }
  }

  uploadImages(photoPaths) {
    let photos = [];
    for (let i = 0; i < photoPaths.length; i++) {
      this.uploadImage(i, photoPaths[i]);
    }

    // Return the reference so we can create a post there
    return newReference;
  }

  uploadImage(positionInPost, localPath) {
    // Need to somehow get the post id first

    // We should store images in the format
    // Posts/<random ID>/<position in post>
    // This will avoid conflicts with names
    const ref = this.storage.child(`/Posts/${""}/${positionInPost}}`);

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
}
