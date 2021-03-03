import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import Upload from "./Upload.js";

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
  #database;
  #auth;
  #upload;

  constructor() {
    // Initialise the connection
    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);
    }

    this.#database = firebase.firestore();
    this.#auth = firebase.auth();
    this.#auth.onIdTokenChanged(this.onIdTokenChanged);
    this.#upload = new Upload(firebase);

    console.log("*Created connection to Firebase");
  }

  /**
   * This is called when user signs in or out, and also whenever the token changes
   * due to expiry or password change
   *
   * @param {*} user
   */
  onIdTokenChanged = (user) => {
    //console.log(`Auth ID token changed for user`);

    // Still signed in
    if (this.#auth.currentUser) {
      this.onSignedIn(user);
    }
    // Signed out
    else {
      this.onSignedOut(user);
    }
  };

  onSignedOut = (user) => {
    console.log(`*User signed out`);
  };

  onSignedIn = (user) => {
    console.log(`*User ${user.email} signed in`);
  };

  isLoggedIn = () => {
    const user = this.#auth.currentUser;
    if (user) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Returns JSON with .username and .email
   */
  currentUser = () => {
    const user = this.#auth.currentUser;

    if (user) {
      return { username: user.displayName, email: user.email };
    }
  };

  close() {
    firebase.app().delete();
    console.log("*Closed connection to Firebase");
  }

  error(message) {
    return { error: message };
  }

  async login(email, password) {
    let success, error;

    // Sign in with auth
    await this.#auth
      .signInWithEmailAndPassword(email, password)
      // Now we should check that the user has an account
      .then(async () => {
        const user = this.currentUser();
        const profile = await this.#database
          .doc(`Users/${user.username}`)
          .get();

        if (profile.exists) {
          success = true;
        } else {
          throw Error("Auth valid but account doesn't exist in database");
        }
      })
      .catch((err) => {
        success = false;
        error = err.message;
      });

    // Return the success status for tests and error message if there is one
    return { success: success, error: error };
  }

  async logout() {
    let success, error;

    await this.#auth
      .signOut()
      .then(() => {
        success = true;
      })
      .catch((err) => {
        success = false;
        error = err.message;
      });

    // Return the success status for tests and error message if there is one
    return { success: success, error: error };
  }

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
      likes: 0,
      dislikes: 0,
      user: data.user.id,
      //time: doc._createTime.toDate(),
      ID: doc.id,
    };

    return post;
  }

  async getAllPosts() {
    let posts = [];

    await this.#database
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

  getBrowse = async () => {
    const user = this.#auth.currentUser;

    // User is signed in
    // In this case we want to get posts from followed feeds

    // user != null
    if (false) {
      const user = this.currentUser();
      const profile = await this.getProfile(username, true);
      let dictionary = {};
    }
    // Not signed in
    else {
      return await this.getAllPosts();
    }
  };

  async getMap() {
    const snapshot = await this.#database
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

  getOurProfile = async () => {
    const user = this.currentUser();
    return await this.getProfile(user.username, true);
  };

  /**
   *
   * @param {string} username
   * @param {boolean} loadFollowedFeeds
   */
  async getProfile(username, loadFollowedFeeds = true) {
    // Get the user with username
    const userRef = this.#database.doc(`Users/${username}`);
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

  async createProfile(email, username, password, isPublic = true) {
    let success, error;

    await this.#auth
      // Create the user
      .createUserWithEmailAndPassword(email, password)
      // Set their display name
      .then(async () => {
        var user = this.#auth.currentUser;
        user.updateProfile({
          displayName: username,
        });
      })
      // Now create their profile in the database
      .then(async () => {
        const userData = {
          email: email,
          public: isPublic,
          score: 0,
          followedUsers: [],
          followedTags: [],
          followedChannels: [],
        };

        // Now we should create the profile
        const ref = this.#database.doc(`Users/${username}`);
        await ref.set(userData);

        success = true;
      })
      // Catch any errors
      .catch((err) => {
        success = false;
        error = err.message;
      });

    // Return the success status for tests and error message if there is one
    return { success: success, error: error };
  }

  // SHOULD TAKE ARRAY OF FILE OBJECTS FOR IMAGES
  // THESE CAN BE UPLOADED STRAIGHT AWAY TO STORAGE
  // SHOULD HAVE THE FILE TYPE KNOWN

  async createPost(title, channelName, GPS, tags, photos) {
    const user = this.#auth.currentUser;
    const username = this.currentUser().username;

    const ref = this.#database.collection("Posts").doc();
    const newKey = ref.id;

    // upload the images
    URLs = await this.#upload.uploadImagesForPost(newKey, photos);

    // Get a reference to the user posting this
    const userRef = this.#database.doc(`Users/${username}`);
    // Throw an error if it does not exist
    if (!(await userRef.get()).exists) {
      return this.error(`User "${userRef.path}" does not exist`);
    }

    // Get a reference to the channel
    const channelRef = this.#database.doc(`Channels/${channelName}`);
    // Throw an error if it does not exist
    if (!(await channelRef.get()).exists) {
      return this.error(`Channel "${channelRef.path}" does not exist`);
    }

    // Get refs to all the tags
    let tagRefs = [];
    for (let i = 0; i < tags.length; i++) {
      const tagRef = this.#database.doc(`Tags/${tags[i]}`);
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
      photos: URLs,
      score: 0,
      user: userRef,
    };

    // Write the post data to the database
    await ref.set(postData);
    return newKey;
  }

  async createTag(name, description, icon, similarTags = []) {
    const ref = this.#database.doc(`Tags/${name}`);

    // Tag already exists
    if ((await ref.get()).exists) {
      return this.error(`Tag "${ref.path}" already exists`);
    }
    // Otherwise, create the tag
    else {
      let similarTagRefs = [];
      for (let i = 0; i < similarTags.length; i++) {
        const similarRef = this.#database.doc(`Tags/${similarTags[i]}`);

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
}
