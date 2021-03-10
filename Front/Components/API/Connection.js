import Firebase from "./Firebase.js";
import Server from "./Server.js";

export default class Connection {
  #firebase;
  #server;

  constructor() {
    this.#firebase = new Firebase();
    this.#server = new Server();

    this.PostInteractionType = Object.freeze({
      remove: 0,
      like: 1,
      dislike: 2,
    });
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

  /**
   *
   * @param {string} postID
   * @param {number} interaction PostInteractionType enum, contains .remove, .like and .dislike
   */
  interactWithPost = async (postID, interaction) => {
    return await this.#firebase.interactWithPost(postID, interaction);
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

  /**
   *
   * @param {object} filters contains { followedUsers: bool, followedChannels: bool, sortBy: string, orderBy: string }
   * @returns
   */
  getBrowse = async () => {
    return await this.#firebase.getBrowse();
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

  createPost = async (title, channelName, GPS, photos) => {
    return await this.#firebase.createPost(title, channelName, GPS, photos);
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
