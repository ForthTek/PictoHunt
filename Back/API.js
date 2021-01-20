// https://en.wikipedia.org/wiki/JSDoc
// JavaScriptDoc conventions

// https://github.com/mlaanderson/database-js
// Node package name: database-js
var Connection = require('database-js').Connection;

const config =
{
  host: 'sql2.freesqldatabase.com',
  user: 'sql2387221',
  password: 'PictoHunt',
  database: 'sql2387221'
};



/**
 * Async function that performs a query on the database. Must be called 
 * from within an async function block and must include the await keyword before the call.
 * @code (async () => { let x = await query('query', ...'args'); })();
 * 
 * @param {string} query SQl query. Can be a basic query with predefined values or a prepared statement 
 * with placeholder ?s for values.
 * @param {*[]} args The arguments to substitute into the prepared statement if there are any.
 * @returns {*} The rows affected by the query (could be NULL if the query failed).
 * @throws Various SQL database exceptions for invalid arguments, duplicate entries etc.
 */
async function query(query, ...args) {
  // Function taken from official documentation and modified: 
  // https://github.com/mlaanderson/database-js-mysql

  let connection, statement, rows, error = null;
  // Create connection to the database
  connection = new Connection(`mysql://${config.user}:${config.password}@${config.host}/${config.database}`);

  try {
    // Prepare the statement
    statement = connection.prepareStatement(query);

    switch (args.length) {
      // Do basic query in this case (no parameters)
      case 0:
        rows = await statement.query();
        break;
      // All other cases add parameters to the prepared statement
      case 1:
        rows = await statement.query(args[0]);
        break;
      case 2:
        rows = await statement.query(args[0], args[1]);
        break;
      case 3:
        rows = await statement.query(args[0], args[1], args[2]);
        break;
      case 4:
        rows = await statement.query(args[0], args[1], args[2], args[3]);
        break;
      case 5:
        rows = await statement.query(args[0], args[1], args[2], args[3], args[4]);
        break;
      case 6:
        rows = await statement.query(args[0], args[1], args[2], args[3], args[4], args[5]);
        break;
      case 7:
        rows = await statement.query(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        break;
      case 8:
        rows = await statement.query(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
        break;
    }
  }
  // Catch any errors
  catch (err) {
    error = err;
  }
  // Always close the connection
  finally {
    await connection.close();
  }

  // Throw the error that we caught
  if (error != null) {
    throw error;
  }
  // Otherwise return the affected rows (could be NULL)
  else {
    return rows;
  }
}



//(async () => { let x = await query("SELECT * FROM User"); console.log(x); })();

//(async () => { let x = await query("SELECT * FROM User WHERE username = ?", "sol"); console.log(x); })();

//(async () => { let x = await query("SELECT * FROM User WHERE (username = ? AND userPassword = ? AND levelOfAccess =  ?)", "sol", "password", "user"); console.log(x); })();


// QUERIES
// Get rows
const SQL_GET_USER = "SELECT * FROM User WHERE username = ?;";
const SQL_GET_ALL_POSTS_BY_USER = "SELECT * FROM Post WHERE posterAccount = ?;";
const SQL_GET_ALL_POSTS = "SELECT * FROM Post ORDER BY globalPostID DESC;";
const SQL_GET_ALL_COMMENTS_ON_POST = "SELECT * FROM CommentsInPost WHERE postID = ? ORDER BY globalCommentID DESC;";
const SQL_GET_ALL_INTERACTION_ON_POST = "SELECT COUNT(interaction) FROM LikesDislikesInPost WHERE (postID = ? AND interaction = ?)";
const SQL_GET_ALL_CHANNELS = "SELECT * FROM Channel;";
const SQL_GET_ALL_POSTS_IN_CHANNEL = "SELECT * FROM Post WHERE postedTo = ?;";

// Add rows
const SQL_ADD_USER = "INSERT INTO User(username, userPassword, emailAddress, isPublic, levelOfAccess) VALUES (?, ?, ?, ?, ?)";
const SQL_ADD_TAG = "INSERT INTO Tag(name, description) VALUES(?, ?);";
const SQL_ADD_SIMILAR_TAG = "INSERT INTO SimilarTags(tag, similarTag) VALUES(?, ?);";

// Set rows

// Remove rows



// Get methods
function getUser(username) {
  // Syntax for calling the async query function 
  (async () => {
    try {
      return await query(SQL_GET_USER, username);
    }
    catch (error) {
      throw error;
    }
  })();
}

function getAllPostsByUser(username) {
  // Syntax for calling the async query function 
  (async () => {
    try {
      return await query(SQL_GET_ALL_POSTS_BY_USER, username);
    }
    catch (error) {
      throw error;
    }
  })();
}

function getAllPosts() {
  // Syntax for calling the async query function 
  (async () => {
    try {
      return await query(SQL_GET_ALL_POSTS);
    }
    catch (error) {
      throw error;
    }
  })();
}


function getAllCommentsOnPost(globalPostID) {

}

function getAllInteractionsOnPost(globalPostID) {

}

function getAllChannels() {

}

function getAllPostsInChannel() {

}


// Create methods


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
function createUser(username, password, email, isPublicAccount = true, isAdminAccount = false) {
  let sql = "INSERT INTO User(username, userPassword, emailAddress, isPublic, levelOfAccess) VALUES (?, ?, ?, ?, ?)";
  let data = null;

  // Syntax for calling the async query function 
  (async () => {
    try {
      data = await query(sql, username, password, email, isPublicAccount, isAdminAccount);
      return true;
    }
    catch (error) {
      console.log(error);
    }
  })();

  return false;
}


function createTag(name, description, ...similarTags) {
  let sql = "INSERT INTO Tag(name, description) VALUES(?, ?);";
  let similarTag = "INSERT INTO SimilarTags(tag, similarTag) VALUES(?, ?);";
  let data = null;

  // Syntax for calling the async query function 
  (async () => {
    try {
      data = await query(sql, name, description);

      for (let i = 0; i < similarTags.length; i++) {
        try {
          await query(similarTag, name, similarTags[i]);
        }
        catch (err) {

        }
      }

      return true;
    }
    catch (error) {
      console.log(error);
    }
  })();

  return false;
}

function addSimilarTag(name, ...similarTags) {
  let similarTag = "INSERT INTO SimilarTags(tag, similarTag) VALUES(?, ?);";

  // Syntax for calling the async query function 
  (async () => {
    try {
      if (similarTags.length > 0) {
        for (let i = 0; i < similarTags.length; i++) {
          await query(similarTag, name, similarTags[i]);
        }
        return true;
      }
    }
    catch (error) {
      console.log(error);
    }
  })();

  return false;
}

function createChannel(name, description, usernameCreatedBy) {
  let sql = "INSERT INTO Channel(name, description, createdBy) VALUES(?, ?, ?);";
  let similarTag = "INSERT INTO TagsInChannel(channelName, tagName) VALUES(?, ?)";

  // Syntax for calling the async query function 
  (async () => {
    try {
      data = await query(sql, name, description);

      for (let i = 0; i < similarTags.length; i++) {
        await query(similarTag, name, similarTags[i]);
      }

      return true;
    }
    catch (error) {
      console.log(error);
    }
  })();

  return false;



}


function createPost(title, accountUsername, channelNamePostedTo, photos, tags, GPSValue) {
  let query = "INSERT INTO Channel() VALUES(?, ?, ?);";

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
  let sql = "SELECT * FROM UserFollowingUser(username, userBeingFollowed) VALUES(?, ?);";
  let data = null;

  // Syntax for calling the async query function 
  (async () => {
    try {
      data = await query(sql, accountUsername, usernameToFollow);
      return true;
    }
    catch (error) {
      console.log(error);
    }
  })();

  return false;
}

//followUser("sol", "sol-private");



// Set methods


function setAccountPublic(username, trueFalse) {

}


// Remove methods

