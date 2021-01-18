// https://en.wikipedia.org/wiki/JSDoc
// JavaScriptDoc conventions

const config =
{
  host: 'sql2.freesqldatabase.com',
  user: 'sql2387221',
  password: 'PictoHunt',
  database: 'sql2387221'
}

var Connection = require('database-js').Connection;


// Syntax for calling the query async function 
(async () => { 
  let v = await query("SELECT * FROM User WHERE username = ?", 'sol'); 
  console.log(v);
})();


async function query(query, args) {
  let connection, statement, rows;
  connection = new Connection("mysql://" + config.user + ":" + config.password + "@" + config.host + "/" + config.database);

  try {
    statement = await connection.prepareStatement(query);
    rows = await statement.query(args);
    //console.log(rows);
  } catch (error) {
    console.log(error);
  } finally {
    await connection.close();
  }

  return rows;
}


/*
async function query() {
  let connection, statement, rows;
  connection = new Connection("mysql://" + config.user + ":" + config.password + "@" + config.host + "/" + config.database);

  try {
    statement = await connection.prepareStatement("SELECT * FROM User WHERE username = ?");
    rows = await statement.query('sol');
    console.log(rows);
  } catch (error) {
    console.log(error);
  } finally {
    await connection.close();
  }
}
*/


/*
(async () => {
  let connection, statement, rows;
  connection = new Connection("mysql://" + config.user + ":" + config.password + "@" + config.host + "/" + config.database);

  try {
    statement = await connection.prepareStatement("SELECT * FROM User WHERE username = ?");
    rows = await statement.query('sol');
    console.log(rows);
  } catch (error) {
    console.log(error);
  } finally {
    await connection.close();
  }
})();
*/








// Create methods

/**
 * Function that creates a new account for the user.
 * 
 * @param {string} username The username of the account.
 * @param {string} password The password of the account.
 * @param {string} email The email address of the account.
 * @returns {boolean} The operation was successful.
 */
function createUser(username, password, email) {
  return createUser(username, password, email, true, false);
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
function createUser(username, password, email, isPublicAccount, isAdminAccount) {
  let query = "INSERT INTO User(username, userPassword, emailAddress, isPublic, levelOfAccess) VALUES (?, ?, ?, ?, ?)";

  return true;
}


function createTag(name, description) {
  let query = "INSERT INTO Tag(name, description) VALUES(?, ?);";

  // INSERT INTO SimilarTags(tag, similarTag) VALUES("Cat", "Cute animals");
}

function createChannel(name, description, usernameCreatedBy) {
  let query = "INSERT INTO Channel(name, description, createdBy) VALUES(?, ?, ?);";

  // INSERT INTO TagsInChannel(channelName, tagName) VALUES("Cute animal pics", "Cute animals");
}

function createPost(title, accountUsername, channelNamePostedTo, photos, tags) {
  return createPost(title, accountUsername, channelNamePostedTo, photos, tags, null)
}

function createPost(title, accountUsername, channelNamePostedTo, photos, tags, GPSValue) {
  let query = "INSERT INTO Channel(name, description, createdBy) VALUES(?, ?, ?);";

  // INSERT INTO PhotosInPost(postID, photoURL, orderInPost) VALUES(2, "www.cute-cats-in-my-area.co.uk/cat2.png", 1);
  // TAGS IN POST
}


function createComment(postID, accountUsername, comment) {
  let query = "INSERT INTO CommentsInPost(postID, commentAccount, commentText, commentTime) VALUES(?, ?, ?, NOW());";

}


const PostInteractionTypes = Object.freeze({ "like": 1, "dislike": 2, "removeInteraction": 3 })

function interactWithPost(postID, accountUsername, interactionType) {
  let query = "INSERT INTO CommentsInPost(postID, commentAccount, commentText, commentTime) VALUES(?, ?, ?, NOW());";

  if (interactionType == PostInteractionTypes.removeInteraction) {
    // Remove the interaction instead
  }
  else {

  }
}

function followChannel(accountUsername, channelName) {
  let query = "INSERT INTO UserFollowingChannel(username, channelName) VALUES(?, ?);";

}

function followTag(accountUsername, tagName) {
  let query = "INSERT INTO UserFollowingTag(username, tag) VALUES(?, ?);";

}

function followUser(accountUsername, usernameToFollow) {
  let query = "INSERT INTO UserFollowingUser(username, userBeingFollowed) VALUES(?, ?);";

}




// Get methods


function getAllPostsByUser(username) {

}

function getUserDetails(username) {

}




// Set methods


function setAccountPublic(username, trueFalse) {

}

