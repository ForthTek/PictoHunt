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
  #stateUpdateCallbacks;

  /**
   * Dictionary for storing loaded posts locally. We should check a post isn't here before loading it from the server
   */
  #posts;

  #browseFilters;
  #browse;

  /**
   * Enum used when calling interactWithPost(ID, type). Values: .remove, .like and .dislike
   */
  PostInteractionType;
  /**
   * Filters for the browse screen
   */
  BrowseFilters;
  /**
   * Filters for ordering posts
   */
  OrderBy;

  constructor() {
    // Initialise the connection
    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);
      console.log("*Created connection to Firebase");
    }

    this.#database = firebase.firestore();
    this.#auth = firebase.auth();
    this.#auth.onIdTokenChanged(this.onIdTokenChanged);

    this.#upload = new Upload(firebase);

    this.#stateUpdateCallbacks = [];

    this.PostInteractionType = Object.freeze({
      remove: 0,
      like: 1,
      dislike: 2,
    });
    this.BrowseFilters = Object.freeze({
      allPosts: 0,
      followedUsers: 1,
      followedChannels: 2,
    });
    this.OrderBy = Object.freeze({
      mostRecent: 0,
      highestScore: 1,
    });

    this.#posts = {};
    this.#browse = [];
    this.#browseFilters = [BrowseFilters.allPosts];
  }

  /**
   * This is called when user signs in or out, and also whenever the token changes
   * due to expiry or password change
   *
   * @param {*} user
   */
  onIdTokenChanged = (user) => {
    // Still signed in
    if (this.#auth.currentUser) {
      //console.log(`*User ${this.#auth.currentUser.email} signed in`);
    }
    // Signed out
    else {
      //console.log(`*User signed out`);
    }

    // Now invoke the callbacks
    for (let i = 0; i < this.#stateUpdateCallbacks.length; i++) {
      try {
        this.#stateUpdateCallbacks[i]();
      } catch (error) {
        console.log("Failed to invoke callback:");
        console.log(error);
      }
    }
  };

  /**
   * Invokes the function with no parameters, whenever the login state of the user changes
   *
   * @param {function} callback
   */
  addLoginStateListener = (callback) => {
    this.#stateUpdateCallbacks.push(callback);
  };

  /**
   * @returns true if there is a user logged in
   */
  isLoggedIn = () => {
    if (this.#auth.currentUser) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * @returns JSON with .username and .email
   */
  currentUser = () => {
    const user = this.#auth.currentUser;

    if (user) {
      return { username: user.displayName, email: user.email };
    } else {
      return false;
    }
  };

  /**
   * Closes the connection to Firebase
   */
  close = () => {
    firebase.app().delete();
    console.log("*Closed connection to Firebase");
  };

  /**
   *
   * @param {string} email
   * @param {string} password
   * @returns true if successful
   */
  login = async (email, password) => {
    // Sign in with auth
    await this.#auth
      .signInWithEmailAndPassword(email, password)
      // Now we should check that the user has an account
      .then(async () => {
        const user = this.currentUser();
        const profile = await this.#database
          .doc(`Users/${user.username}`)
          .get();

        if (!profile.exists) {
          throw Error("Auth valid but account doesn't exist in database");
        }
      })
      .catch((error) => {
        throw error;
      });

    return true;
  };

  /**
   * @returns true if succesful
   */
  logout = async () => {
    await this.#auth.signOut().catch((error) => {
      throw error;
    });

    return true;
  };

  /**
   *
   * @param {string} email
   * @returns true if succesful
   */
  resetPassword = async (email) => {
    // Send an email to the address
    await this.#auth.sendPasswordResetEmail(email).catch((error) => {
      throw error;
    });

    return true;
  };

  /**
   *
   * @param {string} email
   * @param {string} username
   * @param {string} password
   * @param {boolean} isPublic
   * @returns true if succesful
   */
  createProfile = async (email, username, password, isPublic = true) => {
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
      })
      // Catch any errors
      .catch((error) => {
        throw error;
      });

    return true;
  };

  /**
   *
   * @param {string} postID
   * @param {number} interaction PostInteractionType enum, contains .remove, .like and .dislike
   */
  interactWithPost = async (postID, interaction) => {
    const username = this.currentUser().username;
    const likeRef = this.#database.doc(`Posts/${postID}/Likes/${username}`);
    const dislikeRef = this.#database.doc(
      `Posts/${postID}/Dislikes/${username}`
    );

    // Just set the data to be the timestamp as we have to use something
    const data = {
      timestamp: firebase.firestore.Timestamp.now(),
    };

    switch (interaction) {
      case this.PostInteractionType.remove:
        await likeRef.delete();
        await dislikeRef.delete();
        break;
      case this.PostInteractionType.like:
        await likeRef.set(data);
        await dislikeRef.delete();
        break;
      case this.PostInteractionType.dislike:
        await dislikeRef.set(data);
        await likeRef.delete();
        break;
      default:
        throw Error("Invalid PostInteractionType");
    }
  };

  /**
   * Loads the post from local memory if it has been loaded before, or gets it from the server if not.
   *
   * @param {string} postID
   * @returns
   */
  getPost = async (postID) => {
    // Post isn't stored locally so we need to load it from the database
    if (!this.#posts[postID]) {
      const ref = this.#database.doc(`Posts/${postID}`);
      const document = await ref.get();

      return await this.getPostFromDoc(document);
    }

    // Load it from local storage instead
    return this.#posts[postID];
  };

  async getPostFromDoc(doc) {
    const postID = doc.id;

    // Post isn't stored locally so we need to load it
    if (!this.#posts[postID]) {
      if (doc.exists) {
        // Save this post to the local storage
        this.#posts[postID] = await this.returnPost(doc);
      }
      // Throw an error if it doesn't exist
      else {
        throw new Error(`Post ${ref.path} does not exist`);
      }
    }

    return this.#posts[postID];
  }

  /**
   * Loads the post from local memory and updates the values if it can, or gets it from the server if not.
   *
   * @param {string} postID
   * @returns
   */
  getUpdatedPost = async (postID) => {
    // Stored locally so we need to calculate the updated values of stuff
    if (this.#posts[postID]) {
      let updated = await this.getUpdatedPostValues(postID);
      this.#posts[postID].score = updated.score;
      this.#posts[postID].likes = updated.likes;
      this.#posts[postID].dislikes = updated.dislikes;
      this.#posts[postID].interactedWith = updated.interactedWith;

      return this.#posts[postID];
    }
    // Post isn't stored locally so we just need to load it
    else {
      return await this.getPost(postID);
    }
  };

  async getUpdatedPostFromDoc(doc) {
    // TODO
  }

  async getUpdatedPostValues(postID) {
    // Count the likes and dislikes
    const likes = await this.#database
      .collection(`Posts/${postID}/Likes`)
      .get()
      .then((snap) => {
        return snap.size;
      });
    const dislikes = await this.#database
      .collection(`Posts/${postID}/Dislikes`)
      .get()
      .then((snap) => {
        return snap.size;
      });

    // See if the user has interacted with the post
    let interaction = this.PostInteractionType.remove;

    const user = this.currentUser();
    if (user) {
      if (
        (
          await this.#database
            .doc(`Posts/${postID}/Likes/${user.username}`)
            .get()
        ).exists
      ) {
        interaction = this.PostInteractionType.like;
      } else if (
        (
          await this.#database
            .doc(`Posts/${postID}/Dislikes/${user.username}`)
            .get()
        ).exists
      ) {
        interaction = this.PostInteractionType.dislike;
      }
    }

    return {
      score: likes - dislikes,
      likes: likes,
      dislikes: dislikes,
      interactedWith: interaction,
    };
  }

  async returnPost(doc) {
    const data = await doc.data();

    // Get the tag names from the references
    let tags = [];
    for (let i = 0; i < data.tags.length; i++) {
      tags.push(data.tags[i].id);
    }

    const values = await this.getUpdatedPostValues(doc.id);

    // Return the data in a nice format
    let post = {
      title: data.title,
      GPS: data.GPS,
      channel: data.channel.id,
      tags: tags,
      photos: data.photos,
      score: values.score,
      likes: values.likes,
      dislikes: values.dislikes,
      user: data.user.id,
      time: data.timestamp,
      interactedWith: values.interactedWith,
      ID: doc.id,
    };

    return post;
  }

  async getAllPosts() {
    let posts = [];

    await this.#database
      .collection("Posts")
      .get()
      .then(async (querySnapshot) => {
        // Must use async foreach here
        for await (let doc of querySnapshot.docs) {
          // NEED TO OPTIMISE
          let x = await this.getUpdatedPost(doc.id);
          posts.push(x);
        }
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

  getMap = async () => {
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
  };

  getOurProfile = async () => {
    const user = this.currentUser();
    return await this.getProfile(user.username, false);
  };

  /**
   *
   * @param {string} username
   * @param {boolean} loadFollowedFeeds
   */
  getProfile = async (username, loadFollowedFeeds = false) => {
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
      throw new Error(`User "${userRef.path}" does not exist`);
    }
  };

  createPost = async (title, channelName, GPS, tags, photos) => {
    const username = this.currentUser().username;

    const ref = this.#database.collection("Posts").doc();
    const newKey = ref.id;

    // Get a reference to the user posting this
    const userRef = this.#database.doc(`Users/${username}`);
    // Throw an error if it does not exist
    if (!(await userRef.get()).exists) {
      throw new Error(`User "${userRef.path}" does not exist`);
    }

    // Get a reference to the channel
    const channelRef = this.#database.doc(`Channels/${channelName}`);
    // Throw an error if it does not exist
    if (!(await channelRef.get()).exists) {
      throw new Error(`Channel "${channelRef.path}" does not exist`);
    }

    // Get refs to all the tags
    let tagRefs = [];
    for (let i = 0; i < tags.length; i++) {
      const tagRef = this.#database.doc(`Tags/${tags[i]}`);
      // Throw an error if it does not exist
      if (!(await tagRef.get()).exists) {
        throw new Error(`Tag "${tagRef.path}" does not exist`);
      } else {
        tagRefs.push(tagRef);
      }
    }

    // Upload the images
    let URLs = await this.#upload.uploadImagesForPost(newKey, photos);

    // Do some input validation stuff here
    const postData = {
      title: title,
      GPS: GPS,
      channel: channelRef,
      tags: tagRefs,
      photos: URLs,
      score: 0,
      user: userRef,
      timestamp: firebase.firestore.Timestamp.now(),
    };

    // Write the post data to the database
    await ref.set(postData);
    return newKey;
  };

  async createTag(name, description, icon, similarTags = []) {
    const ref = this.#database.doc(`Tags/${name}`);

    // Tag already exists
    if ((await ref.get()).exists) {
      throw new Error(`Tag "${ref.path}" already exists`);
    }
    // Otherwise, create the tag
    else {
      let similarTagRefs = [];
      for (let i = 0; i < similarTags.length; i++) {
        const similarRef = this.#database.doc(`Tags/${similarTags[i]}`);

        // Tag already exists
        if (!(await similarRef.get()).exists) {
          throw new Error(`Tag "${similarRef.path}" does not exist`);
        } else {
          similarTagRefs.push(similarRef);
        }
      }

      const tag = {
        description: description,
        icon: icon,
        similarTags: similarTagRefs,
        timestamp: firebase.firestore.Timestamp.now(),
      };

      return await ref.set(tag);
    }
  }
}
