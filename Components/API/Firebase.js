import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as geofire from "geofire-common";
import Upload from "./Upload.js";
import Filter from "./Filter.js";

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
  createProfile = async (email, username, password) => {
    const ref = this.database.doc(`Users/${username}`);
    const data = await ref.get();

    if (data.exists) {
      throw new Error(`User ${username} already exists`);
    }

    await this.auth
      // Create the user
      .createUserWithEmailAndPassword(email, password)
      // Set their display name
      .then(() =>
        this.auth.currentUser.updateProfile({
          displayName: username,
        })
      )
      // Reload the auth now that the username has been changed
      .then(() => this.auth.currentUser.reload())
      // Now create their profile in the database
      .then(async () => {
        const userData = {
          challengeScore: 0,
          timestamp: firebase.firestore.Timestamp.now(),
          // Add username as string just for searching
          search: username.toUpperCase(),
          UID: this.auth.currentUser.uid,
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

    return await ref.get().then(async (doc) => this.getPostFromDoc(doc));
  };

  async getPostFromDoc(doc) {
    if (doc.exists) {
      const data = doc.data();
      const user = this.currentUser();

      let GPS = null;
      if (data.GPS) {
        GPS = {
          latitude: data.GPS.latitude,
          longitude: data.GPS.longitude,
        };
      }

      let values = await Promise.all([
        await this.database.doc(`Posts/${doc.id}/Likes/${user.username}`).get(),
        await this.database
          .doc(`Posts/${doc.id}/Dislikes/${user.username}`)
          .get(),
      ]);

      // See if the user has interacted with the post
      let liked = values[0].exists;
      let disliked = values[1].exists;

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
        liked: liked,
        disliked: disliked,
        public: data.public,
        ID: doc.id,
      };

      return post;
    }
    // Throw an error if it doesn't exist
    else {
      throw new Error(`Doc does not exist`);
    }
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
    try {
      const user = this.currentUser();

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
      throw Error(error.message);
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
        throw new Error(error);
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
      challengeScore: data.challengeScore,
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
      likes: 0,
      dislikes: 0,
      score: 0,
      createdBy: userRef,
      timestamp: firebase.firestore.Timestamp.now(),
      public: false,
      checkedChallenge: false,
      UID: this.auth.currentUser.uid,
    };

    // Set the data
    await ref.set(postData);
    return newKey;
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
  searchWithPrefix = async (collection, search, field = "search") => {
    // No longer used as its too slow RIP :(
    const query = search.toUpperCase();
    const LIMIT = 5;

    return await this.database
      .collection(collection)
      .where(field, ">=", query)
      // Append \uf8ff as it has a high unicode value so pretty much any string with the prefix will match before it
      // Value is 63,743 so we have a lot of leway
      .where(field, "<=", query + "\uf8ff")
      //.orderBy()
      .limit(LIMIT)
      .get()
      .then((res) => {
        // Return only the IDs
        return res.docs.map((x) => x.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async getChallenges(completed = false) {
    const username = this.currentUser().username;
    const refInvited = this.database.collection(`Users/${username}/Challenges`);

    const now = firebase.firestore.Timestamp.now();

    try {
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

        // Challenge has expired
        if (!data.completed && now > data.deadline) {
          console.log(
            `Deadline for challenge has expired. Removing it from the user's challenges`
          );
          await this.database
            .doc(`Users/${username}/Challenges/${all[i].ID}`)
            .delete();
        }
        // Valid challenge
        else {
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
              ID: `${all[i].ID}:${j}`,
            });
          }

          challenges.push({
            ID: all[i].ID,
            description: data.description,
            deadline: data.deadline.toDate(),
            score: data.score,
            tasks: tasks,
            completed: completed,
          });
        }
      }

      // Sort by deadline
      challenges.sort((x, y) => x.deadline >= y.deadline);

      return challenges;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // async getChallengesByMe() {
  //   const username = this.currentUser().username;
  //   const ref = this.database.doc(`Users/${username}`);

  //   try {
  //     let all = await this.database
  //       .collection("Challenges")
  //       .where("createdBy", "==", ref)
  //       .get()
  //       .then((snapshot) => {
  //         let challenges = [];
  //         snapshot.forEach((doc) => {
  //           const data = doc.data();
  //           let tasks = [];
  //           for (let j = 0; j < data.tasks.length; j++) {
  //             task = data.tasks[j];

  //             let lat = null;
  //             let long = null;
  //             if (task.GPS) {
  //               lat = task.GPS.latitude;
  //               long = task.GPS.longitude;
  //             }

  //             tasks.push({
  //               description: task.description,
  //               channel: task.channel.id,
  //               latitude: lat,
  //               longitude: long,
  //               radius: task.radius,
  //               completed: all[i].completed[j],
  //             });
  //           }

  //           challenges.push({
  //             ID: all[i].ID,
  //             description: data.description,
  //             deadline: data.deadline.toDate(),
  //             score: data.score,
  //             tasks: tasks,
  //             completed: completed,
  //           });
  //         });
  //         return all;
  //       });

  //     // Sort by deadline
  //     challenges.sort((x, y) => x.deadline >= y.deadline);

  //     return challenges;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // }

  async deleteChallengeRequest(challengeKey) {
    const user = this.currentUser();
    const ref = this.database.doc(
      `Users/${user.username}/Challenges/${challengeKey}`
    );

    await ref.delete();
    return true;
  }

  reportPost = async (postID, reason) => {
    const postRef = this.database.doc(`Posts/${postID}`);
    const postData = await postRef.get();
    if (!postData.exists) {
      throw new Error(`Post ${postID} does not exist`);
    }

    const ref = this.database.collection(`Reports`).doc();

    const report = {
      UID: this.auth.currentUser.uid,
      timestamp: firebase.firestore.Timestamp.now(),
      post: postRef,
      reason: reason,
    };

    await ref.set(report);
    return true;
  };

  /*
   * ADMIN FUNCTIONS
     The current user must be an admin for these to work
   */

  /**
   *
   * @returns
   */
  isAdmin = async () => {
    const username = this.currentUser().username;
    return await this.database
      .doc(`Admins/${username}`)
      .get()
      .then(
        (res) => true,
        (error) => false
      );
  };

  /**
   *
   * @param {string} postID
   * @param {boolean} value
   * @returns
   */
  setPostPublic = async (postID, value) => {
    const ref = this.database.doc(`Posts/${postID}`);
    await ref.update({ public: value });
    return `Updated post ${postID} to be public ${value}`;
  };

  /**
   *
   * @param {string} postID
   * @returns
   */
  deletePost = async (postID) => {
    // Try to delete the photos
    // An admin won't have permission to do this so it could fail
    const data = await this.database.doc(`Posts/${postID}`).get();
    const photos = data.data().photos.length;
    await this.upload.deleteImagesForPost(postID, photos);

    // Delete the post
    await this.database.doc(`Posts/${postID}`).delete();

    return `Deleted post ${postID}`;
  };

  /**
   *
   * @returns
   */
  getSummaryReport = async () => {
    const username = this.currentUser().username;
    await this.database.doc(`Admins/${username}`).get();

    const values = await Promise.all([
      this.database
        .collection(`Posts`)
        .where("public", "==", true)
        .get()
        .then((snap) => snap.docs.length),
      this.database
        .collection(`Posts`)
        .where("public", "==", false)
        .get()
        .then((snap) => snap.docs.length),
      this.database
        .collection(`Users`)
        .get()
        .then((snap) => snap.docs.length),
      this.database
        .collection(`Channels`)
        .get()
        .then((snap) => snap.docs.length),
      this.database
        .collection(`Challenges`)
        .get()
        .then((snap) => snap.docs.length),
    ]);

    return {
      publicPosts: values[0],
      privatePosts: values[1],
      users: values[2],
      channels: values[3],
      challenges: values[4],
    };
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

  getAllReportedPosts = async (filter = new Filter()) => {
    return await this.database
      .collection("Reports")
      .get()
      .then(async (snapshot) => {
        let posts = [];
        let all = {};

        // Each report
        snapshot.forEach((doc) => {
          const data = doc.data();
          const ID = data.post.id;
          // Ensure that we don't have this post yet
          if (!all[ID]) {
            all[ID] = true;
            // Add the post to list
            posts.push(
              data.post.get().then((postDoc) => this.getPostFromDoc(postDoc))
            );
          }
        });

        let loaded = await Promise.all(posts);

        // Remove all public posts
        for (let i = 0; i < loaded.length; i++) {
          if (!loaded[i].public) {
            loaded.splice(i);
          }
        }

        loaded.sort((x, y) => this.comparePost(x, y, filter));

        return loaded;
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });
  };
}
