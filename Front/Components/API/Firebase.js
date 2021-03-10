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

const SORT_BY_TIME = "timestamp";
const SORT_BY_SCORE = "score";
const ORDER_BY_ASC = "asc";
const ORDER_BY_DESC = "desc";

export default class Firebase {
  #database;
  #auth;
  #upload;
  #stateUpdateCallbacks;

  /**
   * Dictionary for storing loaded posts locally. We should check a post isn't here before loading it from the server
   */
  #posts;

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

    this.#posts = {};
  }

  /**
   * This is called when user signs in or out, and also whenever the token changes
   * due to expiry or password change
   *
   * @param {*} user
   */
  onIdTokenChanged = (user) => {
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
          timestamp: firebase.firestore.Timestamp.now(),
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
    // Update the current version if there is one
    if (this.#posts[postID]) {
      const doc = await this.#database.doc(`Posts/${postID}`).get();
      const data = doc.data();

      // Calculate the values we need to
      this.#posts[postID].score = data.score;
      this.#posts[postID].likes = data.likes;
      this.#posts[postID].dislikes = data.dislikes;
      this.#posts[postID].interactedWith = await this.calculateInteractedWith(
        postID
      );

      // Return the updated version
      return this.#posts[postID];
    }
    // Post isn't stored locally so we need to load it from the database
    else {
      const ref = this.#database.doc(`Posts/${postID}`);
      const document = await ref.get();
      return await this.getPostFromDoc(document);
    }
  };

  async getPostFromDoc(doc) {
    if (doc.exists) {
      const postID = doc.id;

      // Load the post from the database if we don't have it
      if (!this.#posts[postID]) {
        this.#posts[postID] = await this.returnPost(doc);
      }

      // Now calculate the new values
      return this.getPost(postID);
    }
    // Throw an error if it doesn't exist
    else {
      throw new Error(`Post ${postID} does not exist`);
    }
  }

  async calculateInteractedWith(postID) {
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

    return interaction;
  }

  async returnPost(doc) {
    const data = await doc.data();
    const interaction = await this.calculateInteractedWith(doc.id);

    // Return the data in a nice format
    let post = {
      title: data.title,
      GPS: data.GPS,
      channel: data.channel.id,
      photos: data.photos,
      score: data.score,
      likes: data.likes,
      dislikes: data.dislikes,
      user: data.user.id,
      time: data.timestamp.toDate(),
      interactedWith: interaction,
      ID: doc.id,
    };

    return post;
  }

  async getAllPosts(
    filters = {
      sortBy: "time",
      orderBy: "asc",
    }
  ) {
    let posts = [];

    await this.#database
      .collection("Posts")
      .orderBy("timestamp", "desc")
      .get()
      .then(async (querySnapshot) => {
        // Must use async foreach here
        for await (let doc of querySnapshot.docs) {
          let x = await this.getPostFromDoc(doc);
          posts.push(x);
        }
      })
      .catch((error) => {
        console.log(error);
        throw Error("Couldn't load all posts");
      });

    return posts;
  }

  async getFollowedUserRefs(username) {
    let users = [];
    await this.#database
      .collection(`Users/${username}/FollowedUsers`)
      .get()
      .then(async (querySnapshot) => {
        // Must use async foreach here
        for await (let doc of querySnapshot.docs) {
          const followedUsername = doc.id;
          const ref = this.#database.doc(`Users/${followedUsername}`);
          users.push(ref);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return users;
  }

  async getFollowedChannelRefs(username) {
    let channels = [];
    await this.#database
      .collection(`Users/${username}/FollowedChannels`)
      .get()
      .then(async (querySnapshot) => {
        // Must use async foreach here
        for await (let doc of querySnapshot.docs) {
          const followedChannelName = doc.id;
          const ref = this.#database.doc(`Channels/${followedChannelName}`);
          channels.push(ref);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return channels;
  }

  /**
   *
   * @param {object} filters contains { followedUsers: bool, followedChannels: bool, sortBy: string, orderBy: string }
   * @returns
   */
  getBrowse = async (
    filters = {
      followedUsers: true,
      followedChannels: true,
      sortBy: SORT_BY_TIME,
      orderBy: ORDER_BY_ASC,
    }
  ) => {
    // User is signed in and we want to filter for specific posts
    if (
      false
      // this.#auth.currentUser != null &&
      // (filters.followedUsers || filters.followedChannels)
    ) {
      let allFollowedUsers = await this.getFollowedUserRefs("Test");
      let allFollowedChannels = await this.getFollowedChannelRefs("Test");
      console.log(
        `User Test is following ${allFollowedUsers.length} users and ${allFollowedChannels.length} channels`
      );
      //console.log(allFollowedUsers)

      let allPosts = [];

      await this.#database
        .collection("Posts")
        .where("user", "in", allFollowedUsers)
        .orderBy(filters.orderBy, filters.sortBy)
        .get()
        .then(async (querySnapshot) => {
          // Must use async foreach here
          for await (let doc of querySnapshot.docs) {
            let x = await this.getPostFromDoc(doc);
            allPosts.push(x);
          }
        });
      console.log(allPosts);

      return allPosts;
    }
    // Not signed in, just return all posts
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

    snapshot.forEach((doc) => {
      // Return the data in a nice format
      let mapPost = {
        GPS: doc.data().GPS,
        icon: doc.data().photos[0],
        ID: doc.id,
      };

      posts.push(mapPost);
    });

    return posts;
  };

  /**
   *
   * @param {string} username
   * @param {boolean} loadFollowedFeeds
   */
  getProfile = async (username) => {
    // Get the user with username
    const userRef = this.#database.doc(`Users/${username}`);
    const userData = await userRef.get();

    // Process the data
    if (userData.exists) {
      const data = userData.data();

      let posts = [];
      let users = [];
      let channels = [];
      let score = 0;

      await this.#database
        .collection(`Users/${username}/Posts`)
        .orderBy("timestamp", "desc")
        .get()
        .then(async (querySnapshot) => {
          // Must use async foreach here
          for await (let doc of querySnapshot.docs) {
            let post = await this.getPost(doc.id);
            posts.push(post);
            score += post.score;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      await this.#database
        .collection(`Users/${username}/FollowedUsers`)
        .get()
        .then(async (querySnapshot) => {
          // Must use async foreach here
          for await (let doc of querySnapshot.docs) {
            const username = doc.id;
            users.push(username);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      await this.#database
        .collection(`Users/${username}/FollowedChannels`)
        .get()
        .then(async (querySnapshot) => {
          // Must use async foreach here
          for await (let doc of querySnapshot.docs) {
            const channel = doc.id;
            channels.push(channel);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      let user = {
        username: username,
        email: data.email,
        public: data.public,
        score: score,
        posts: data.posts,
        timestamp: data.timestamp.toDate(),
        posts: posts,
        followedUsers: users,
        followedChannels: channels,
      };

      return user;
    }
    // Throw an error if the user does not exist
    else {
      throw new Error(`User "${username}" does not exist`);
    }
  };

  createPost = async (title, channelName, GPS, photos) => {
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

    // Upload the images
    let URLs = await this.#upload.uploadImagesForPost(newKey, photos);

    // Do some input validation stuff here
    const postData = {
      title: title,
      GPS: GPS,
      channel: channelRef,
      photos: URLs,
      score: 0,
      user: userRef,
      timestamp: firebase.firestore.Timestamp.now(),
    };

    // Write the post data to the database
    await ref.set(postData);

    // Add a ref to this post in the user's posts
    const profilePosts = this.#database.doc(
      `Users/${username}/Posts/${newKey}`
    );
    const channelPosts = this.#database.doc(
      `Channels/${channelName}/Posts/${newKey}`
    );

    const refData = { timestamp: postData.timestamp, score: postData.score };

    // Add a reference to this post in the channel and user page
    profilePosts.set(refData);
    channelPosts.set(refData);

    return newKey;
  };

  createChannel = async (name, description) => {
    const username = this.currentUser().username;
    const ref = this.#database.doc(`Channels/${name}`);
    const channel = await ref.get();
    const userRef = this.#database.doc(`Users/${username}`);

    if (channel.exists) {
      throw new Error(`Channel ${name} already exists`);
    } else {
      const data = {
        description: description,
        timestamp: firebase.firestore.Timestamp.now(),
        createdBy: userRef,
      };

      await ref.set(data);

      return true;
    }
  };

  getChannel = async (name) => {
    const ref = this.#database.doc(`Channels/${name}`);
    const channel = await ref.get();

    if (!channel.exists) {
      throw new Error(`Channel ${name} does not exist`);
    } else {
      return await this.returnChannel(channel);
    }
  };

  async returnChannel(doc) {
    const data = await doc.data();
    const username = data.createdBy.id;

    // Return the data in a nice format
    let channel = {
      name: doc.id,
      description: data.description,
      timestamp: data.timestamp.toDate(),
      createdBy: username,
    };

    return channel;
  }

  /**
   *
   * @param {string} usernameToFollow
   * @param {boolean} value
   */
  followUser = async (usernameToFollow, value) => {
    // Get the user with username
    const followRef = this.#database.doc(`Users/${usernameToFollow}`);
    const userData = await followRef.get();

    if (!userData.exists) {
      throw new Error(`User ${usernameToFollow} does not exist`);
    }

    const username = this.currentUser().username;
    const ref = this.#database.doc(
      `Users/${username}/FollowedUsers/${usernameToFollow}`
    );

    // Follow this user
    if (value) {
      await ref.set({ timestamp: firebase.firestore.Timestamp.now() });
    }
    // Unfollow this user
    else {
      await ref.delete();
    }
  };

  /**
   *
   * @param {string} channelNameToFollow
   * @param {boolean} value
   */
  followChannel = async (channelNameToFollow, value) => {
    // Get the user with username
    const followRef = this.#database.doc(`Channels/${channelNameToFollow}`);
    const channelData = await followRef.get();

    if (!channelData.exists) {
      throw new Error(`Channel ${channelNameToFollow} does not exist`);
    }

    const username = this.currentUser().username;
    const ref = this.#database.doc(
      `Users/${username}/FollowedChannels/${channelNameToFollow}`
    );

    // Follow this user
    if (value) {
      await ref.set({ timestamp: firebase.firestore.Timestamp.now() });
    }
    // Unfollow this user
    else {
      await ref.delete();
    }
  };
}
