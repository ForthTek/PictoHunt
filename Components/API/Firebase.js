import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as geofire from "geofire-common";

import Upload from "./Upload.js";

import Filter from "./Filter.js";
import ChallengeTask from "./ChallengeTask.js";

const config = {
  apiKey: "AIzaSyCvQv_waR8vtFZIrmHlgVexp0VrrGNwGBE",
  authDomain: "picto-hunt.firebaseapp.com",
  projectId: "picto-hunt",
  storageBucket: "picto-hunt.appspot.com",
  messagingSenderId: "762056308518",
  appId: "1:762056308518:web:ec820ae748f1191699b3e7",
  measurementId: "G-HDTRBXWKV1",
};

export default class Firebase {
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

    this.database = firebase.firestore();
    this.auth = firebase.auth();
    this.auth.onIdTokenChanged(this.onIdTokenChanged);

    this.upload = new Upload(firebase);

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
    if (this.auth.currentUser) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * @returns JSON with .username and .email
   */
  currentUser = () => {
    const user = this.auth.currentUser;

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
    await this.auth
      .signInWithEmailAndPassword(email, password)
      // Now we should check that the user has an account
      .then(async () => {
        const user = this.currentUser();
        const profile = await this.database.doc(`Users/${user.username}`).get();

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
    await this.auth.signOut().catch((error) => {
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
    await this.auth.sendPasswordResetEmail(email).catch((error) => {
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
    const ref = this.database.doc(`Users/${username}`);
    const data = await ref.get();

    if (data.exists) {
      throw new Error(`User ${username} already exists`);
    }

    await this.auth
      // Create the user
      .createUserWithEmailAndPassword(email, password)
      .then(() => this.auth.currentUser)
      // Set their display name
      .then((user) =>
        user.updateProfile({
          displayName: username,
        })
      )
      // Reload the auth now that the username has been changed
      .then(() => this.auth.currentUser.reload())
      // Now create their profile in the database
      .then(async () => {
        const userData = {
          email: email,
          public: isPublic,
          timestamp: firebase.firestore.Timestamp.now(),
          // Add username as string just for searching
          search: username.toUpperCase(),
          uid: this.auth.currentUser.uid,
        };

        // Now we should create the profile
        await ref.set(userData);
      })
      // Catch any errors
      .catch((error) => {
        console.log(error);
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
    const likeRef = this.database.doc(`Posts/${postID}/Likes/${username}`);
    const dislikeRef = this.database.doc(
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
    const ref = this.database.doc(`Posts/${postID}`);
    const doc = await ref.get();

    // Update the current version if there is one
    if (this.#posts[postID]) {
      const data = doc.data();

      let interaction = await this.calculateInteractedWith(postID);

      // Calculate the values we need to
      this.#posts[postID].score = data.score;
      this.#posts[postID].likes = data.likes;
      this.#posts[postID].dislikes = data.dislikes;
      this.#posts[postID].liked = interaction.liked;
      this.#posts[postID].disliked = interaction.disliked;

      // Return the updated version
      return this.#posts[postID];
    }
    // Post isn't stored locally so we need to load it from the database
    else {
      return await this.getPostFromDoc(doc);
    }
  };

  async getPostFromDoc(doc) {
    if (doc.exists) {
      const postID = doc.id;

      // Load the post from the database if we don't have it
      if (!this.#posts[postID]) {
        this.#posts[postID] = await this.returnPost(doc);
      }
      // Otherwise just update the values on it
      else {
        let interaction = await this.calculateInteractedWith(postID);
        const data = await doc.data();

        // Calculate the values we need to
        this.#posts[postID].score = data.score;
        this.#posts[postID].likes = data.likes;
        this.#posts[postID].dislikes = data.dislikes;
        this.#posts[postID].liked = interaction.liked;
        this.#posts[postID].disliked = interaction.disliked;
      }

      // Return the updated version
      return this.#posts[postID];
    }
    // Throw an error if it doesn't exist
    else {
      throw new Error(`Doc does not exist`);
    }
  }

  async calculateInteractedWith(postID) {
    // See if the user has interacted with the post
    let liked = false;
    let disliked = false;

    const user = this.currentUser();
    if (user) {
      liked = (
        await this.database.doc(`Posts/${postID}/Likes/${user.username}`).get()
      ).exists;

      if (!liked) {
        disliked = (
          await this.database
            .doc(`Posts/${postID}/Dislikes/${user.username}`)
            .get()
        ).exists;
      }
    }

    return { liked: liked, disliked: disliked };
  }

  async returnPost(doc) {
    const data = await doc.data();
    const interaction = await this.calculateInteractedWith(doc.id);

    let GPS = null;
    if (data.GPS) {
      GPS = {
        latitude: data.GPS.latitude,
        longitude: data.GPS.longitude,
      };
    }

    // Return the data in a nice format
    let post = {
      title: data.title,
      GPS: GPS,
      channel: data.channel.id,
      photos: data.photos,
      score: data.score,
      likes: data.likes,
      dislikes: data.dislikes,
      user: data.createdBy.id,
      time: data.timestamp.toDate(),
      liked: interaction.liked,
      disliked: interaction.disliked,
      ID: doc.id,
    };

    return post;
  }

  async getFollowedUserRefs(username) {
    let users = [];
    await this.database
      .collection(`Users/${username}/FollowedUsers`)
      .get()
      .then(async (querySnapshot) => {
        // Must use async foreach here
        for await (let doc of querySnapshot.docs) {
          const followedUsername = doc.id;
          const ref = this.database.doc(`Users/${followedUsername}`);
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
    await this.database
      .collection(`Users/${username}/FollowedChannels`)
      .get()
      .then(async (querySnapshot) => {
        // Must use async foreach here
        for await (let doc of querySnapshot.docs) {
          const followedChannelName = doc.id;
          const ref = this.database.doc(`Channels/${followedChannelName}`);
          channels.push(ref);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return channels;
  }

  getBrowse = async (filter) => {
    const user = this.currentUser();
    const filterFollowing = filter.followedUsers || filter.followedChannels;

    // If there is no user, or filter specifies to load all posts
    if (!user || !filterFollowing) {
      return await this.getAllPosts(filter);
    }
    // Otherwise load following
    else {
      try {
        let allFollowedUsers = await this.getFollowedUserRefs(user.username);
        let allFollowedChannels = await this.getFollowedChannelRefs(
          user.username
        );

        const isFollowingUsers = allFollowedUsers.length > 0;
        const isFollowingChannels = allFollowedChannels.length > 0;

        if (
          filter.followedUsers &&
          !filter.followedChannels &&
          !isFollowingUsers
        ) {
          throw new Error("Not following any users");
        }
        if (
          filter.followedChannels &&
          !filter.followedUsers &&
          !isFollowingChannels
        ) {
          throw new Error("Not following any channels");
        }
        if (!isFollowingUsers && !isFollowingChannels) {
          throw new Error("Not following any users or channels");
        }

        let alreadyAdded = {};
        let requests = [];

        if (filter.followedUsers) {
          await this.database
            .collection("Posts")
            .where("public", "==", true)
            .where("createdBy", "in", allFollowedUsers)
            .orderBy(filter.orderBy, filter.direction)
            .get()
            .then(async (snapshot) => {
              snapshot.forEach((doc) => {
                const key = doc.id;

                // Only add the post if its not already been added
                if (!alreadyAdded[key]) {
                  requests.push(this.getPostFromDoc(doc));
                  alreadyAdded[key] = true;
                }
              });
            });
        }

        if (filter.followedChannels) {
          await this.database
            .collection("Posts")
            .where("public", "==", true)
            .where("channel", "in", allFollowedChannels)
            .orderBy(filter.orderBy, filter.direction)
            .get()
            .then(async (snapshot) => {
              snapshot.forEach((doc) => {
                const key = doc.id;

                // Only add the post if its not already been added
                if (!alreadyAdded[key]) {
                  requests.push(this.getPostFromDoc(doc));
                  alreadyAdded[key] = true;
                }
              });
            });
        }

        let posts = await Promise.all(requests);

        // Need to sort the list again if we filtered by both channel and user
        if (filter.followedUsers && filter.followedChannels) {
          // console.log(`Manually sorting posts with filter:`);
          // console.log(filter);
          posts.sort((x, y) => this.comparePost(x, y, filter));
        }

        return posts;
      } catch (error) {
        console.log(error);
        throw Error(`Failed to get browse (${error.message})`);
      }
    }
  };

  comparePost(post1, post2, filter) {
    const invert = filter.direction === Filter.DIRECTION_DESC ? -1 : 1;

    // Assume asc and use invert if we need to
    switch (filter.orderBy) {
      case Filter.ORDER_BY_TIME:
        const p1Time = post1.time.getTime();
        const p2Time = post2.time.getTime();
        if (p1Time < p2Time) {
          return invert * -1;
        } else if (p1Time > p2Time) {
          return invert * 1;
        } else {
          return 0;
        }
      case Filter.ORDER_BY_SCORE:
        if (post1.score < post2.score) {
          return invert * -1;
        } else if (post1.score > post2.score) {
          return invert * 1;
        } else {
          return 0;
        }
    }
  }

  async getPosts(query) {
    return await query
      .get()
      .then(async (snapshot) => {
        let posts = [];

        snapshot.forEach((x) => {
          posts.push(this.getPostFromDoc(x));
        });

        // Use promise all to send multiple requests at once, and wait for all the respnses in one go
        return await Promise.all(posts);
      })
      .catch((error) => {
        console.log(error);
        throw new Error(`Failed to load posts (${error.message})`);
      });
  }

  /**
   *
   * @param {string} username
   * @param {boolean} loadFollowedFeeds
   */
  getProfile = async (username, filter = new Filter()) => {
    // Get the user with username
    const ref = this.database.doc(`Users/${username}`);
    const userData = await ref.get();

    // Throw an error if the user does not exist
    if (!userData.exists) {
      throw new Error(`User "${username}" does not exist`);
    }

    let isFollowing = false;
    const currentUser = this.currentUser().username;
    const following = await this.database
      .doc(`Users/${currentUser}/FollowedUsers/${username}`)
      .get();
    if (following.exists) {
      isFollowing = true;
    }

    let posts = await this.getPosts(
      this.database
        .collection("Posts")
        .where("public", "==", true)
        .where("createdBy", "==", ref)
        .orderBy(filter.orderBy, filter.direction)
    );

    // Sort the posts
    posts.sort((x, y) => this.comparePost(x, y, filter));

    // Calculate score
    let score = 0;
    for (let i = 0; i < posts.length; i++) {
      score += posts[i].score;
    }

    const data = userData.data();
    let user = {
      username: username,
      email: data.email,
      timestamp: data.timestamp.toDate(),
      score: score,
      isFollowing: isFollowing,
      posts: posts,
    };

    return user;
  };

  createPost = async (
    title,
    channelName,
    latitude = null,
    longitude = null,
    photos
  ) => {
    const username = this.currentUser().username;

    const ref = this.database.collection("Posts").doc();
    const newKey = ref.id;

    // Get a reference to the user posting this
    const userRef = this.database.doc(`Users/${username}`);
    // Throw an error if it does not exist
    if (!(await userRef.get()).exists) {
      throw new Error(`User "${userRef.path}" does not exist`);
    }

    // Get a reference to the channel
    const channelRef = this.database.doc(`Channels/${channelName}`);
    // Throw an error if it does not exist
    if (!(await channelRef.get()).exists) {
      throw new Error(`Channel "${channelRef.path}" does not exist`);
    }

    // Upload the images
    let URLs = await this.upload.uploadImagesForPost(newKey, photos);

    // Only create GPS point if lat and long is not null
    const GPS =
      latitude != null && longitude != null
        ? new firebase.firestore.GeoPoint(latitude, longitude)
        : null;
    const GPSHash =
      GPS != null ? geofire.geohashForLocation([latitude, longitude]) : null;

    // Do some input validation stuff here
    const postData = {
      title: title,
      GPS: GPS,
      GPSHash: GPSHash,
      channel: channelRef,
      photos: URLs,
      score: 0,
      createdBy: userRef,
      timestamp: firebase.firestore.Timestamp.now(),
    };

    // Set the data
    await ref.set(postData);
    return newKey;
  };

  createChannel = async (name, description) => {
    const username = this.currentUser().username;
    const ref = this.database.doc(`Channels/${name}`);
    const channel = await ref.get();
    const userRef = this.database.doc(`Users/${username}`);

    if (channel.exists) {
      throw new Error(`Channel ${name} already exists`);
    } else {
      const data = {
        description: description,
        timestamp: firebase.firestore.Timestamp.now(),
        createdBy: userRef,
        // Add the name just as a string - for use in search queries
        search: name.toUpperCase(),
      };

      await ref.set(data);

      return true;
    }
  };

  getChannel = async (name, filter = new Filter()) => {
    const ref = this.database.doc(`Channels/${name}`);
    const channel = await ref.get();

    // Throw an error if the channel does not exist
    if (!channel.exists) {
      throw new Error(`Channel ${name} does not exist`);
    }

    let isFollowing = false;
    const currentUser = this.currentUser().username;
    const following = await this.database
      .doc(`Users/${currentUser}/FollowedChannels/${name}`)
      .get();
    if (following.exists) {
      isFollowing = true;
    }

    let posts = await this.getPosts(
      this.database
        .collection("Posts")
        .where("public", "==", true)
        .where("channel", "==", ref)
    );

    // Sort the posts
    posts.sort((x, y) => this.comparePost(x, y, filter));

    // Calculate score
    let score = 0;
    for (let i = 0; i < posts.length; i++) {
      score += posts[i].score;
    }

    const data = channel.data();
    let c = {
      name: name,
      description: data.description,
      createdBy: data.createdBy.id,
      timestamp: data.timestamp.toDate(),
      score: score,
      isFollowing: isFollowing,
      posts: posts,
    };

    return c;
  };

  /**
   *
   * @param {string} usernameToFollow
   * @param {boolean} value
   */
  followUser = async (usernameToFollow, value) => {
    // Get the user with username
    const followRef = this.database.doc(`Users/${usernameToFollow}`);
    const userData = await followRef.get();

    if (!userData.exists) {
      throw new Error(`User ${usernameToFollow} does not exist`);
    }

    const username = this.currentUser().username;
    const ref = this.database.doc(
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

    return value;
  };

  /**
   *
   * @param {string} channelNameToFollow
   * @param {boolean} value
   */
  followChannel = async (channelNameToFollow, value) => {
    // Get the user with username
    const followRef = this.database.doc(`Channels/${channelNameToFollow}`);
    const channelData = await followRef.get();

    if (!channelData.exists) {
      throw new Error(`Channel ${channelNameToFollow} does not exist`);
    }

    const username = this.currentUser().username;
    const ref = this.database.doc(
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

    return value;
  };

  /**
   *
   * @param {string} collection
   * @param {string} field
   * @param {string} search
   * @param {Filter} filter
   * @returns
   */
  searchWithPrefix = async (
    collection,
    search,
    field = "search",
    filter = new Filter()
  ) => {
    const query = search.toUpperCase();

    return (
      this.database
        .collection(collection)
        .where(field, ">=", query)
        // Append \uf8ff as it has a high unicode value so pretty much any string with the prefix will match before it
        // Value is 63,743 so we have a lot of leway
        .where(field, "<=", query + "\uf8ff")
        //.orderBy()
        //.limit()
        .get()
        .then(
          (res) => {
            // Return only the IDs
            return res.docs.map((x) => x.id);
          },
          (error) => {
            console.log(error);
          }
        )
    );
  };

  /**
   *
   * @param {Date} deadline
   * @param {number} score
   * @param {ChallengeTask[]} tasksPerPost Array of JSON objects containing .channel (channel name), .latitude and .longitude (required location)
   * @returns
   */
  async createChallenge(description, deadline, score, tasksPerPost) {
    const milliseconds = deadline.getTime() - new Date().getTime();
    const hours = milliseconds / 3600000;
    const minDuration = 1;
    const minRadius = 25;
    const minScore = 10;

    if (milliseconds < 0 || hours <= 1) {
      console.log(
        `Trying to create challenge with duration of ${hours} hours (${milliseconds}ms)`
      );
      throw new Error(
        `Challange duration must be more than ${minDuration} hour`
      );
    }
    if (tasksPerPost.length == 0) {
      throw new Error(`Challenge must contain at least one task`);
    }

    let tasks = [];
    for (let i = 0; i < tasksPerPost.length; i++) {
      const channelName = tasksPerPost[i].channel;
      const channelRef = this.database.doc(`Channels/${channelName}`);
      const channelData = await channelRef.get();

      if (!channelData.exists) {
        throw new Error(`Channel ${channelName} does not exist`);
      }

      const GPS =
        tasksPerPost[i].latitude != null && tasksPerPost[i].longitude != null
          ? (GPS = new firebase.firestore.GeoPoint(
              tasksPerPost[i].latitude,
              tasksPerPost[i].longitude
            ))
          : null;
      if (GPS != null && tasksPerPost[i].radius < minRadius) {
        throw new Error(`Radius must be at least ${minRadius}`);
      }

      tasks.push({
        description: tasksPerPost[i].description,
        channel: channelRef,
        GPS: GPS,
        radius: tasksPerPost[i].radius,
      });
    }

    if (score < minScore) {
      throw new Error(`Reward score must be at least ${minScore}`);
    }

    const ref = this.database.collection("Challenges").doc();
    const key = ref.id;

    const username = this.currentUser().username;
    const userRef = this.database.doc(`Users/${username}`);

    const data = {
      description: description,
      deadline: firebase.firestore.Timestamp.fromDate(deadline),
      score: score,
      createdBy: userRef,
      tasks: tasks,
    };

    await ref.set(data);
    return key;
  }

  async getChallenges(completed = false) {
    const username = this.currentUser().username;
    const refInvited = this.database.collection(`Users/${username}/Challenges`);

    let all = await refInvited
      .where("completed", "==", completed)
      .get()
      .then((snapshot) => {
        let all = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          all.push({ ID: doc.id, completed: data.tasks });
        });
        return all;
      });

    let challenges = [];
    for (let i = 0; i < all.length; i++) {
      const ref = await this.database.doc(`Challenges/${all[i].ID}`).get();
      const data = ref.data();

      let tasks = [];
      for (let j = 0; j < data.tasks.length; j++) {
        task = data.tasks[j];

        let lat = null;
        let long = null;
        if (task.GPS) {
          lat = task.GPS.latitude;
          long = task.GPS.longitude;
        }

        tasks.push({
          description: task.description,
          channel: task.channel.id,
          latitude: lat,
          longitude: long,
          radius: task.radius,
          completed: all[i].completed[j],
        });
      }

      challenges[i] = {
        description: data.description,
        deadline: data.deadline.toDate(),
        score: data.score,
        tasks: tasks,
        completed: completed,
      };
    }

    return challenges;
  }
}
