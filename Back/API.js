// https://en.wikipedia.org/wiki/JSDoc
// JavaScriptDoc conventions

var Database = require("./database.js");



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



// Get methods

/**
 * 
 * @param {string} username 
 */
async function getUser(username) {
  const SQL = "SELECT * FROM User WHERE username = ?;";

  try {
    let rows = await Database.singleQuery(SQL, username);
    return rows;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

async function getAllPostsByUser(username) {
  const SQL = "SELECT * FROM Post WHERE posterAccount = ?;";

  try {
    let rows = await Database.singleQuery(SQL, username);
    return rows;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

async function getAllPosts() {
  const SQL = "SELECT * FROM Post ORDER BY globalPostID DESC;";

  try {
    let rows = await Database.singleQuery(SQL);
    return rows;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

async function getAllCommentsFromPost(globalPostID) {
  const SQL = "SELECT * FROM CommentsInPost WHERE postID = ? ORDER BY globalCommentID DESC;";

  try {
    let rows = await Database.singleQuery(SQL, globalPostID);
    return rows;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

async function getAllTagsFromPost(globalPostID) {
  const SQL = "SELECT tagName AS name FROM TagsInPost WHERE postID = ?;";

  try {
    let rows = await Database.singleQuery(SQL, globalPostID);

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

async function getAllImagesFromPost(globalPostID) {
  const SQL = "SELECT photoURL AS URL, orderInPost as position FROM PhotosInPost WHERE postID = ?;";

  try {
    let rows = await Database.singleQuery(SQL, globalPostID);
    return rows;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

/**
 * 
 * @param {*} globalPostID 
 * @returns JSON object with value names "likes" and "dislikes".
 */
async function getAllInteractionsOnPost(globalPostID) {
  const SQL = "SELECT COUNT(interaction) AS x FROM LikesDislikesInPost WHERE (postID = ? AND interaction = ?)";

  try {
    let rows = await Database.repeatQuery(SQL, [[globalPostID, "like"], [globalPostID, "dislike"]]);

    let x = {
      likes: rows[0][0].x,
      dislikes: rows[1][0].x,
    };
    return x;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

async function getAllChannels() {
  const SQL = "SELECT * FROM Channel;";

  try {
    return;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

async function getAllPostsInChannel(channelName) {
  const SQL_GET_ALL_POSTS_IN_CHANNEL = "SELECT * FROM Post WHERE postedTo = ?;";

  try {
    return;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

async function getFollowedChannels(username) {

  try {
    return;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

async function getFollowedTags(username) {

  try {
    return;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

async function getFollowedUsers(username) {

  try {
    return;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}

async function getAllLikedPosts(username) {

  try {
    return;
  }
  catch (error) {
    return getErrorMessage(error);
  }
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

const PostInteractionTypes = Object.freeze({ "like": 1, "dislike": 2, "removeInteraction": 3 })

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
  isCorrectPassword, getUser, getAllPostsByUser, getAllPosts, getAllCommentsFromPost, getAllImagesFromPost, getAllTagsFromPost, getAllInteractionsOnPost,
  getAllChannels, getAllPostsInChannel, getFollowedChannels, getFollowedTags, getFollowedUsers, getAllLikedPosts
};