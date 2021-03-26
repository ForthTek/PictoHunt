import ChallengeTask from "./ChallengeTask.js";
import Filter from "./Filter.js";
import Firebase from "./Firebase.js";
import Server from "./Server.js";

export default class Connection {
  #firebase;
  #server;

  constructor() {
    this.#firebase = new Firebase();
    this.#server = new Server();
  }

  /**
   * Closes the connection to Firebase
   */
  close = () => {
    this.#firebase.close();
  };

  /**
   * Invokes the function with no parameters, whenever the login state of the user changes
   *
   * @param {function} callback
   */
  addLoginStateListener = (callback) => {
    return this.#firebase.addLoginStateListener(callback);
  };

  /**
   * @returns true if there is a user logged in
   */
  isLoggedIn = () => {
    return this.#firebase.isLoggedIn();
  };

  /**
   * @returns JSON with .username and .email
   */
  currentUser = () => {
    return this.#firebase.currentUser();
  };

  /**
   *
   * @returns
   */
  isAdmin = async () => {
    return await this.#firebase.isAdmin();
  };

  /**
   *
   * @param {string} postID
   * @param {boolean} public
   * @returns
   */
  setPostPublic = async (postID, public) => {
    return await this.#firebase.setPostPublic(postID, public);
  };

  /**
   *
   * @param {string} email
   * @param {string} password
   * @returns true if successful
   */
  login = async (email, password) => {
    return await this.#firebase.login(email, password);
  };

  /**
   * @returns true if succesful
   */
  logout = async () => {
    return await this.#firebase.logout();
  };

  /**
   *
   * @param {string} email
   * @returns true if succesful
   */
  resetPassword = async (email) => {
    return await this.#firebase.resetPassword(email);
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
    if (await this.#server.containsSwears(username)) {
      throw new Error(`Username ${username} contains a swear`);
    }

    await this.#firebase.createProfile(email, username, password, isPublic);

    await this.#server.getNewChallenges(username);

    return true;
  };

  /**
   *
   * @param {string} postID
   * @returns
   */
  likePost = async (postID) => {
    return await this.#firebase
      .interactWithPost(postID, this.#firebase.PostInteractionType.like)
      .then(
        async () => {
          await this.#server.updatePostValues(postID);
          return true;
        },
        (error) => {
          console.log(error);
          throw new Error(`Server failed to update post ${postID}`);
        }
      )
      .then(async (res) => {
        return this.#firebase.getPost(postID);
      });
  };

  /**
   *
   * @param {string} postID
   * @returns
   */
  dislikePost = async (postID) => {
    return await this.#firebase
      .interactWithPost(postID, this.#firebase.PostInteractionType.dislike)
      .then(
        async () => {
          await this.#server.updatePostValues(postID);
          return true;
        },
        (error) => {
          console.log(error);
          throw new Error(`Server failed to update post ${postID}`);
        }
      )
      .then(async (res) => {
        return this.#firebase.getPost(postID);
      });
  };

  /**
   *
   * @param {string} postID
   * @returns
   */
  removeInteractionFromPost = async (postID) => {
    return await this.#firebase
      .interactWithPost(postID, this.#firebase.PostInteractionType.remove)
      .then(
        async () => {
          await this.#server.updatePostValues(postID);
          return true;
        },
        (error) => {
          console.log(error);
          throw new Error(`Server failed to update post ${postID}`);
        }
      )
      .then(async (res) => {
        return this.#firebase.getPost(postID);
      });
  };

  /**
   *
   * @param {string} postID
   * @returns
   */
  getPost = async (postID) => {
    return await this.#firebase.getPost(postID);
  };

  /**
   *
   * @param {Filter} filter
   * @returns
   */
  getBrowse = async (filter = new Filter()) => {
    const user = this.currentUser();
    const filterFollowing = filter.followedUsers || filter.followedChannels;

    // If there is no user, or filter specifies to load all posts
    if (!user || !filterFollowing) {
      return await this.getAllPosts(filter);
    }
    // Otherwise do browse
    else {
      return await this.#firebase.getBrowse(filter);
    }
  };

  /**
   *
   * @param {Filter} filter
   * @returns
   */
  getAllPosts = async (filter = new Filter()) => {
    return await this.#firebase.getPosts(
      this.#firebase.database
        .collection("Posts")
        .where("public", "==", true)
        .orderBy(filter.orderBy, filter.direction)
    );
  };

  /**
   *
   * @returns
   */
  getMap = async () => {
    return await this.#firebase.getPosts(
      this.#firebase.database
        .collection("Posts")
        .where("public", "==", true)
        .where("GPS", "!=", null)
    );
  };

  /**
   *
   * @param {Filter} filter
   * @returns
   */
  getAllReportedPosts = async (filter = new Filter()) => {
    return await this.#firebase.getPosts(
      this.#firebase.database
        .collection("Posts")
        .where("public", "==", false)
        .orderBy(filter.orderBy, filter.direction)
    );
  };

  /**
   *
   * @returns
   */
  getOurProfile = async () => {
    const user = this.#firebase.currentUser();
    return await this.getProfile(user.username);
  };

  /**
   *
   * @param {string} username
   * @param {boolean} loadFollowedFeeds
   */
  getProfile = async (username, filter = new Filter()) => {
    return await this.#firebase.getProfile(username, filter);
  };

  /**
   *
   * @param {string} title
   * @param {string} channelName
   * @param {number} latitude
   * @param {number} longitude
   * @param {Blob[]} photos
   * @returns
   */
  createPost = async (title, channelName, latitude, longitude, photos) => {
    // Filter any swears from the title
    const newTitle = await this.#server.filterSwears(title);

    return await this.#firebase
      // Create the post
      .createPost(newTitle, channelName, latitude, longitude, photos)
      .then(async (newKey) => {
        // Get the server to approve the post
        let message = await this.#server.approvePost(newKey);
        return { ID: newKey, message: message.message };
      });
  };

  /**
   *
   * @param {string} name
   * @param {string} description
   * @returns
   */
  createChannel = async (name, description) => {
    // Ensure that the channel name and description is clean
    if (await this.#server.containsSwears(name)) {
      throw new Error(`Channel name ${name} contains a swear`);
    }
    if (await this.#server.containsSwears(description)) {
      throw new Error(`Channel description ${description} contains a swear`);
    }

    return await this.#firebase.createChannel(name, description);
  };

  /**
   *
   * @param {string} name
   * @returns
   */
  getChannel = async (name, filter = new Filter()) => {
    return await this.#firebase.getChannel(name, filter);
  };

  /**
   *
   * @param {string} usernameToFollow
   * @param {boolean} value
   */
  followUser = async (usernameToFollow, value) => {
    return await this.#firebase.followUser(usernameToFollow, value);
  };

  /**
   *
   * @param {string} channelNameToFollow
   * @param {boolean} value
   */
  followChannel = async (channelNameToFollow, value) => {
    return await this.#firebase.followChannel(channelNameToFollow, value);
  };

  /**
   *
   * @param {string} text
   * @returns
   */
  searchChannels = async (text) => {
    return await this.#firebase.searchWithPrefix("Channels", text);
  };

  /**
   *
   * @param {string} text
   * @returns
   */
  searchUsers = async (text) => {
    return await this.#firebase.searchWithPrefix("Users", text);
  };

  /**
   *
   * @param {Date} deadline
   * @param {number} score
   * @param {ChallengeTask[]} tasksPerPost Array of JSON objects containing .channel (channel name), .latitude and .longitude (required location)
   * @returns
   */
  createChallenge = async (description, deadline, score, tasksPerPost) => {
    const newDescription = await this.#server.filterSwears(description);

    for (let i = 0; i < tasksPerPost.length; i++) {
      tasksPerPost[i].description = await this.#server.filterSwears(
        tasksPerPost[i].description
      );
    }

    return await this.#firebase.createChallenge(
      newDescription,
      deadline,
      score,
      tasksPerPost
    );
  };

  inviteUsersToChallenge = async (challenge, users) => {
    let promises = [];
    for (let i = 0; i < users.length; i++) {
      promises.push(this.#server.inviteUserToChallenge(challenge, users[i]));
    }
    await Promise.all(promises);
  };

  /**
   *
   * @param {string} challengeID
   * @returns
   */
  deleteChallenge = async (challengeID) => {
    return await this.#firebase.deleteChallengeRequest(challengeID);
  };

  /**
   *
   * @param {boolean} completed
   * @returns
   */
  getChallenges = async (completed = false) => {
    return await this.#firebase.getChallenges(completed);
  };

  /**
   *
   * @param {string} postID
   * @returns
   */
  reportPost = async (postID) => {
    await this.#server.reportPost(postID);
    return true;
  };
}
