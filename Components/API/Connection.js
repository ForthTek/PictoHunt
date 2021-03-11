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
    return await this.#firebase.createProfile(
      email,
      username,
      password,
      isPublic
    );
  };

  likePost = async (postID) => {
    return await this.#firebase
      .interactWithPost(postID, this.#firebase.PostInteractionType.like)
      .then(
        async () => {
          return await this.#server.updatePostValues(postID);
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

  dislikePost = async (postID) => {
    return await this.#firebase
      .interactWithPost(postID, this.#firebase.PostInteractionType.dislike)
      .then(
        async () => {
          return await this.#server.updatePostValues(postID);
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

  removeInteractionFromPost = async (postID) => {
    return await this.#firebase
      .interactWithPost(postID, this.#firebase.PostInteractionType.remove)
      .then(
        async () => {
          return await this.#server.updatePostValues(postID);
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
   * Loads the post from local memory if it has been loaded before, or gets it from the server if not.
   *
   * @param {string} postID
   * @returns
   */
  getPost = async (postID) => {
    return await this.#firebase.getPost(postID);
  };


  getBrowse = async (filter = new Filter()) => {
    return await this.#firebase.getBrowse(filter);
  };

  getAllPosts = async (filter = new Filter()) => {
    return await this.#firebase.getAllPosts(filter);
  };

  getMap = async () => {
    return await this.#firebase.getMap();
  };

  getOurProfile = async () => {
    const user = this.#firebase.currentUser();
    return await this.getProfile(user.username);
  };

  /**
   *
   * @param {string} username
   * @param {boolean} loadFollowedFeeds
   */
  getProfile = async (username) => {
    return await this.#firebase.getProfile(username);
  };

  createPost = async (title, channelName, latitude, longitude, photos) => {
    return await this.#firebase
      // Create the post
      .createPost(title, channelName, latitude, longitude, photos)
      .then(
        async (newKey) => {
          // Then update the number of likes etc
          await this.#server.updatePostValues(newKey);
          return newKey;
        },
        (error) => {
          console.log(error);
          throw new Error(`Server failed to update post ${postID}`);
        }
      );
  };

  createChannel = async (name, description) => {
    return await this.#firebase.createChannel(name, description);
  };

  getChannel = async (name) => {
    return await this.#firebase.getChannel(name);
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
}
