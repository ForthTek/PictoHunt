// https://en.wikipedia.org/wiki/JSDoc
// JavaScriptDoc conventions

var Database = require("./database.js");


const PostInteractionTypes = Object.freeze({ "like": 1, "dislike": 2, "removeInteraction": 3 })



// ALL FUNCTIONS THAT INTERACT WITH THE DATABASE MUST BE CALLED FROM WITHIN AN ASYNC BLOCK:
// (async () => { let x = await query('query', ...'args'); })();


function getErrorMessage(error) {
  // Just for now
  // Will need to do custom messages for errors
  return error.message;
}


// Check methods

/**
 * 
 * @param {string} username 
 * @param {string} password 
 * @returns {boolean}
 */
async function isCorrectPassword(username, password) {
  const SQL = "SELECT salt, userPassword FROM User WHERE username = ?";

  try {
    let rows = (await Database.singleQuery(SQL, username))[0];
    let hash = hashStr(password, rows.salt);

    return hash === rows.userPassword;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

/**
 * 
 * @param {string} username 
 * @param {string} email 
 * @returns {boolean}
 */
async function isCorrectEmail(username, email) {
  const SQL = "SELECT emailAddress FROM User WHERE username = ?";

  try {
    let rows = (await Database.singleQuery(SQL, username))[0];
    return email === rows.emailAddress;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

/**
 * 
 * @param {string} username 
 * @returns {boolean}
 */
async function isPublicAccount(username) {
  const SQL = "SELECT isPublic FROM User WHERE username = ?";

  try {
    let rows = (await Database.singleQuery(SQL, username))[0];
    return rows.isPublic === 1;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}



// Get methods

/**
 * 
 * @param {string} username 
 * @returns {number[]}
 */
async function getAllPostIDsByUser(username) {
  const SQL = "SELECT globalPostID FROM Post WHERE posterAccount = ? ORDER BY globalPostID DESC;";

  try {
    let rows = await Database.singleQuery(SQL, username);
    // Convert to an array of integers
    let posts = [];
    for (let i = 0; i < rows.length; i++) {
      posts.push(rows[i].globalPostID);
    }

    return posts;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

/**
 * 
 * @param {string} channelName 
 * @returns {number[]}
 */
async function getAllPostIDsInChannel(channelName) {
  const SQL = "SELECT globalPostID FROM Post WHERE postedTo = ? ORDER BY globalPostID DESC;";

  try {
    let rows = await Database.singleQuery(SQL, channelName);
    // Convert to an array of integers
    let posts = [];
    for (let i = 0; i < rows.length; i++) {
      posts.push(rows[i].globalPostID);
    }

    return posts;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

/**
 * @returns {number[]}
 */
async function getAllPostIDs() {
  const SQL = "SELECT globalPostID FROM Post ORDER BY globalPostID DESC;";

  try {
    let rows = await Database.singleQuery(SQL);
    // Convert to an array of integers
    let posts = [];
    for (let i = 0; i < rows.length; i++) {
      posts.push(rows[i].globalPostID);
    }

    return posts;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

/**
 * @typedef {object} Post 
 * @property {number} ID 
 * @property {string} title
 * @property {string} user 
 * @property {string} channel
 * @property {number} likes
 * @property {number} dislikes
 * @property {timestamp} time
 * @property {number} GPSLatitude
 * @property {number} GPSLongitude
 * @property {string[]} tags
 * @property {string[]} photos 
 * @property {Comment[]} comments
 */

/**
* @typedef {object} Comment 
* @property {string} user
* @property {string} text
* @property {timestamp} time
*/

/**
 * 
 * @param {number} globalPostID ID of the post to return.
 * @returns {Post} A Post JSON object.
 */
async function getPost(globalPostID) {
  const POST = "SELECT * FROM Post WHERE globalPostID = ?;";
  const TAGS = "SELECT tagName FROM TagsInPost WHERE postID = ?;";
  const IMAGES = "SELECT photoURL FROM PhotosInPost WHERE postID = ? ORDER BY orderInPost;";
  const COMMENTS = "SELECT commentText, commentAccount, commentTime FROM CommentsInPost WHERE postID = ? ORDER BY globalCommentID DESC;";
  const INTERACTIONS = "SELECT COUNT(interaction) AS x FROM LikesDislikesInPost WHERE (postID = ? AND interaction = ?)";

  try {
    // Get all of the data from the post
    let rows = await Database.multiQuery([POST, TAGS, IMAGES, INTERACTIONS, INTERACTIONS, COMMENTS],
      [[globalPostID], [globalPostID], [globalPostID], [globalPostID, "like"], [globalPostID, "dislike"], [globalPostID]]);

    /*
    console.log("RAW DATA:")
    console.log(rows);
    console.log("\n")
    */

    // Now we need to process the data

    // Convert tags to an array of strings
    let tags = [];
    for (let i = 0; i < rows[1].length; i++) {
      tags.push(rows[1][i].tagName);
    }
    // Convert photos to array of URLs
    let photos = [];
    for (let i = 0; i < rows[2].length; i++) {
      photos.push(rows[2][i].photoURL);
    }

    // Convert comments to array of comment objects
    let comments = [];
    for (let i = 0; i < rows[3].length; i++) {
      comments.push({
        user: rows[5][i].commentAccount,
        text: rows[5][i].commentText,
        time: rows[5][i].commentTime,
      });
    }

    // Now return the object
    let post = {
      ID: globalPostID,
      title: rows[0][0].title,
      user: rows[0][0].posterAccount,
      channel: rows[0][0].postedTo,
      likes: rows[3][0].x,
      dislikes: rows[4][0].x,
      time: rows[0][0].timeOfPost,
      GPSLatitude: rows[0][0].GPSLatitude,
      GPSLongitude: rows[0][0].GPSLongitude,
      tags: tags,
      photos: photos,
      comments: comments,
    };

    return post;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

/**
 * 
 * @param {string} username 
 * @return {string[]}
 */
async function getFollowedChannelNames(username) {
  const SQL = "SELECT channelName FROM UserFollowingChannel WHERE username = ?;";

  try {
    let rows = await Database.singleQuery(SQL, username);
    // Convert to an array of strings
    let channels = [];
    for (let i = 0; i < rows.length; i++) {
      channels.push(rows[i].channelName);
    }

    return channels;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

/**
 * @returns {string[]}
 */
async function getAllChannelNames() {
  const SQL = "SELECT name FROM Channel;";

  try {
    let rows = await Database.singleQuery(SQL);
    // Convert to an array of strings
    let channels = [];
    for (let i = 0; i < rows.length; i++) {
      channels.push(rows[i].name);
    }

    return channels;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

/**
 * @returns {string[]}
 */
async function getAllTags() {
  const SQL = "SELECT name FROM Tag;";

  try {
    let rows = await Database.singleQuery(SQL);
    // Convert to an array of strings
    let tags = [];
    for (let i = 0; i < rows.length; i++) {
      tags.push(rows[i].name);
    }

    return tags;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

/**
 * 
 * @param {string} username 
 * @returns {string[]}
 */
async function getFollowedTags(username) {
  const SQL = "SELECT tag FROM UserFollowingTag WHERE username = ?;";

  try {
    let rows = await Database.singleQuery(SQL, username);
    // Convert to an array of strings
    let tags = [];
    for (let i = 0; i < rows.length; i++) {
      tags.push(rows[i].tag);
    }

    return tags;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

/**
 * 
 * @param {string} username 
 * @returns {string[]} 
 */
async function getFollowedUsers(username) {
  const SQL = "SELECT userBeingFollowed AS user FROM UserFollowingUser WHERE username = ?;";

  try {
    let rows = await Database.singleQuery(SQL, username);
    // Convert to an array of strings
    let users = [];
    for (let i = 0; i < rows.length; i++) {
      users.push(rows[i].user);
    }

    return users;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}


async function getAllPostInteractions(username, postInteractionType) {
  const SQL = "SELECT COUNT(postID) AS x FROM LikesDislikesInPost WHERE (likeAccount = ? AND interaction = ?);";

  let value = "";
  switch (postInteractionType) {
    case PostInteractionTypes.like:
      value = "like";
      break;
    case PostInteractionTypes.dislike:
      value = "dislike";
      break;
  }

  try {
    let rows = await Database.singleQuery(SQL, username, value);
    return rows[0].x;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

async function getAllLikedPosts(username) {
  return await getAllPostInteractions(username, PostInteractionTypes.like);
}

async function getAllDislikedPosts(username) {
  return await getAllPostInteractions(username, PostInteractionTypes.dislike);
}












// Create methods

// Function to generate a random string of length (for creating a users salt)
function randomStr(length) {
  var out = "";
  var chars = "1234567890AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
  for (var i = 0; i < length; i++) {
    // Add random character from chars to output
    out += chars[Math.round(Math.random() * chars.length)];
  }
  return out;
}


// Function to hash using a salt
function hashStr(str, salt) {
  var crypto = require('crypto');
  var hash = crypto.createHash('md5').update(str + salt).digest('hex');
  return hash;
}


/**
 * Function that creates a new account for the user.
 * 
 * @param {string} username The username of the account.
 * @param {string} password The password of the account.
 * @param {string} email The email address of the account.
 * @param {boolean} isPublicAccount The account should be public.
 * @param {boolean} isAdminAccount The account should have administrator privileges.
 * @returns {boolean} The operation was successful.
 */
async function createUser(username, password, email, isPublicAccount = true, isAdminAccount = false) {
  let sql = "INSERT INTO User(username, userPassword, emailAddress, isPublic, levelOfAccess, salt) VALUES (?, ?, ?, ?, ?, ?)";

  /* This Will need moved */
  var salt = randomStr((Math.random() * 50) + 10);

  var hash = hashStr(password, salt);
  /* This Will need moved */

  try {
    let data = await Database.singleQuery(sql, username, hash, email, isPublicAccount, isAdminAccount, salt);
    return true;
  }
  catch (error) {
    console.log(error);
  }

  return false;
}

async function createTag(name, description, ...similarTags) {
  let sql = "INSERT INTO Tag(name, description) VALUES(?, ?);";
  let similarTag = "INSERT INTO SimilarTags(tag, similarTag) VALUES(?, ?);";
  let data = null;

  try {
    data = await Database.singleQuery(sql, name, description);

    for (let i = 0; i < similarTags.length; i++) {
      try {
        await Database.singleQuery(similarTag, name, similarTags[i]);
      }
      catch (err) {

      }
    }

    return true;
  }
  catch (error) {
    console.log(error);
  }

  return false;
}

async function addSimilarTag(name, ...similarTags) {
  let similarTag = "INSERT INTO SimilarTags(tag, similarTag) VALUES(?, ?);";

  try {
    if (similarTags.length > 0) {
      for (let i = 0; i < similarTags.length; i++) {
        await Database.singleQuery(similarTag, name, similarTags[i]);
      }
      return true;
    }
  }
  catch (error) {
    console.log(error);
  }

  return false;
}

async function createChannel(name, description, usernameCreatedBy) {
  let sql = "INSERT INTO Channel(name, description, createdBy) VALUES(?, ?, ?);";
  let similarTag = "INSERT INTO TagsInChannel(channelName, tagName) VALUES(?, ?)";

  try {
    data = await Database.singleQuery(sql, name, description);

    for (let i = 0; i < similarTags.length; i++) {
      await Database.singleQuery(similarTag, name, similarTags[i]);
    }

    return true;
  }
  catch (error) {
    console.log(error);
  }

  return false;
}

async function createPost(title, accountUsername, channelNamePostedTo, photos, tags, GPSValue) {
  let query = "INSERT INTO Channel() VALUES(?, ?, ?);";

  // INSERT INTO PhotosInPost(postID, photoURL, orderInPost) VALUES(2, "www.cute-cats-in-my-area.co.uk/cat2.png", 1);
  // TAGS IN POST
}

async function createComment(postID, accountUsername, comment) {
  let query = "INSERT INTO CommentsInPost(postID, commentAccount, commentText, commentTime) VALUES(?, ?, ?, NOW());";

}


async function interactWithPost(postID, accountUsername, interactionType) {
  let query = "INSERT INTO CommentsInPost(postID, commentAccount, commentText, commentTime) VALUES(?, ?, ?, NOW());";

  if (interactionType == PostInteractionTypes.removeInteraction) {
    // Remove the interaction instead
  }
  else {

  }
}

async function followChannel(accountUsername, channelName) {
  let query = "INSERT INTO UserFollowingChannel(username, channelName) VALUES(?, ?);";

}

async function followTag(accountUsername, tagName) {
  let query = "INSERT INTO UserFollowingTag(username, tag) VALUES(?, ?);";

}

async function followUser(accountUsername, usernameToFollow) {
  let sql = "SELECT * FROM UserFollowingUser(username, userBeingFollowed) VALUES(?, ?);";
  let data = null;

  try {
    data = await Database.singleQuery(sql, accountUsername, usernameToFollow);
    return true;
  }
  catch (error) {
    console.log(error);
  }

  return false;
}



// Set methods


async function setAccountPublic(username, trueFalse) {

}


// Remove methods



module.exports = {
  isCorrectPassword, isCorrectEmail, isPublicAccount, getAllPostIDsByUser, getAllPostIDsInChannel, getAllPostIDs, getPost,
  getAllChannelNames, getFollowedChannelNames, getAllTags, getFollowedTags, getFollowedUsers, getAllLikedPosts, getAllDislikedPosts,
};