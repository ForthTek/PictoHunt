// https://en.wikipedia.org/wiki/JSDoc
// JavaScriptDoc conventions

var Database = require("./database.js");



// ALL FUNCTIONS THAT INTERACT WITH THE DATABASE MUST BE CALLED FROM WITHIN AN ASYNC BLOCK:
// (async () => { let x = await query('query', ...'args'); })();



// QUERIES
// Get rows
const SQL_GET_USER = "SELECT * FROM User WHERE username = ?;";
const SQL_GET_ALL_POSTS_BY_USER = "SELECT * FROM Post WHERE posterAccount = ?;";
const SQL_GET_ALL_POSTS = "SELECT * FROM Post ORDER BY globalPostID DESC;";
const SQL_GET_ALL_COMMENTS_ON_POST = "SELECT * FROM CommentsInPost WHERE postID = ? ORDER BY globalCommentID DESC;";
const SQL_GET_ALL_CHANNELS = "SELECT * FROM Channel;";
const SQL_GET_ALL_POSTS_IN_CHANNEL = "SELECT * FROM Post WHERE postedTo = ?;";

// Add rows
const SQL_ADD_USER = "INSERT INTO User(username, userPassword, emailAddress, isPublic, levelOfAccess) VALUES (?, ?, ?, ?, ?)";
const SQL_ADD_TAG = "INSERT INTO Tag(name, description) VALUES(?, ?);";
const SQL_ADD_SIMILAR_TAG = "INSERT INTO SimilarTags(tag, similarTag) VALUES(?, ?);";

// Set rows

// Remove rows



// Get methods
async function getUser(username) {
  try {
    return await Database.singleQuery(SQL_GET_USER, username);
  }
  catch (error) {
    throw error;
  }
}

async function getAllPostsByUser(username) {
  try {
    return await Database.singleQuery(SQL_GET_ALL_POSTS_BY_USER, username);
  }
  catch (error) {
    throw error;
  }
}

async function getAllPosts() {
  try {
    return await Database.singleQuery(SQL_GET_ALL_POSTS);
  }
  catch (error) {
    throw error;
  }
}

async function getAllCommentsOnPost(globalPostID) {

}



/**
 * 
 * @param {*} globalPostID 
 * @returns JSON object with value names "likes" and "dislikes".
 */
async function getAllInteractionsOnPost(globalPostID) {
  const SQL = "SELECT COUNT(interaction) AS x FROM LikesDislikesInPost WHERE (postID = ? AND interaction = ?)";

  let rows = await Database.repeatQuery(SQL, [[globalPostID, "like"], [globalPostID, "dislike"]]);

  let x = {
    likes: rows[0][0].x,
    dislikes: rows[1][0].x,
  };

  return x;
}


async function getAllChannels() {

}

async function getAllPostsInChannel() {

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

