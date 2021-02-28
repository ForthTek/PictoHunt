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

  #returnPost(doc) {
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
      time: doc._createTime.toDate(),
      ID: doc.id,
    };

    return post;
  }

  async getAllPosts() {
    const snapshot = await this.#database.collection("Posts").get();
    let posts = [];

    // Check that there are posts
    if (snapshot._size > 0) {
      snapshot.forEach((doc) => {
        posts.push(this.#returnPost(doc));
      });
    }

    return posts;
  }

  
  async getBrowse(users, channels, tags) {
    const snapshot = await this.#database.collection("Posts").get();
    let posts = [];

    // Check that there are posts
    if (snapshot._size > 0) {
      snapshot.forEach((doc) => {
        posts.push(this.#returnPost(doc));
      });
    }

    return posts;
  }

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
      return this.#error(`User "${userRef.path}" does not exist`);
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
    const ref = this.#database.collection("Posts").doc();
    const newKey = ref.id;

    //console.log(newKey);
    // Maybe we could pass this to the front end so the post photos can be uploaded?

    // Get a reference to the user posting this
    const userRef = this.#database.doc(`Users/${username}`);
    // Throw an error if it does not exist
    if (!(await userRef.get()).exists) {
      return this.#error(`User "${userRef.path}" does not exist`);
    }

    // Get a reference to the channel
    const channelRef = this.#database.doc(`Channels/${channelName}`);
    // Throw an error if it does not exist
    if (!(await channelRef.get()).exists) {
      return this.#error(`Channel "${channelRef.path}" does not exist`);
    }

    // Get refs to all the tags
    let tagRefs = [];
    for (let i = 0; i < tags.length; i++) {
      const tagRef = this.#database.doc(`Tags/${tags[i]}`);
      // Throw an error if it does not exist
      if (!(await tagRef.get()).exists) {
        return this.#error(`Tag "${tagRef.path}" does not exist`);
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
    const ref = this.#database.doc(`Tags/${name}`);

    // Tag already exists
    if ((await ref.get()).exists) {
      return this.#error(`Tag "${ref.path}" already exists`);
    }
    // Otherwise, create the tag
    else {
      let similarTagRefs = [];
      for (let i = 0; i < similarTags.length; i++) {
        const similarRef = this.#database.doc(`Tags/${similarTags[i]}`);

        // Tag already exists
        if (!(await similarRef.get()).exists) {
          return this.#error(`Tag "${similarRef.path}" does not exist`);
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
};
