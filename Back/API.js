// https://en.wikipedia.org/wiki/JSDoc
// JavaScriptDoc conventions

// Node package name: database-js
// https://github.com/mlaanderson/database-js
// Documentation:
// https://github.com/mlaanderson/database-js-mysql
var Connection = require('database-js').Connection;

const config =
{
  host: 'sql2.freesqldatabase.com',
  user: 'sql2387221',
  password: 'PictoHunt',
  database: 'sql2387221'
};






// ALL FUNCTIONS THAT INTERACT WITH THE DATABASE MUST BE CALLED FROM WITHIN AN ASYNC BLOCK:
// (async () => { let x = await query('query', ...'args'); })();






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
async function singleQuery(query, ...args) {
  let rows, error = null;
  // Create connection to the database
  let connection = new Connection(`mysql://${config.user}:${config.password}@${config.host}/${config.database}`);

  try {
    // Prepare the statement
    let statement = connection.prepareStatement(query);

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



/**
 * Async function that performs multiple queries on the database. Must be called 
 * from within an async function block and must include the await keyword before the call.
 * @code (async () => { let x = await query('query', ...'args'); })();
 * 
 * @param {string[]} queries Array containing multiple SQl queries. Can be a basic query with predefined 
 * values or a prepared statement with placeholder ?s for values.
 * @param {*[]} args Array of arrays, with each containing arguments to substitute into the prepared 
 * statement. Must include empty arrays if there are no arguments.
 * @returns {*[]} An array containing the rows affected by each query (could be NULL if that query failed).
 */
async function multiQuery(queries, args) {
  // Create connection to the database
  let connection = new Connection(`mysql://${config.user}:${config.password}@${config.host}/${config.database}`);
  let rows = [];

  for (let i = 0; i < queries.length; i++) {
    let row = null;

    try {
      // Prepare the statement
      let statement = connection.prepareStatement(queries[i]);

      switch (args.length) {
        // Do basic query in this case (no parameters)
        case 0:
          row = await statement.query();
          break;
        // All other cases add parameters to the prepared statement
        case 1:
          row = await statement.query(args[i][0]);
          break;
        case 2:
          row = await statement.query(args[i][0], args[i][1]);
          break;
        case 3:
          row = await statement.query(args[i][0], args[i][1], args[i][2]);
          break;
        case 4:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3]);
          break;
        case 5:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4]);
          break;
        case 6:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4], args[i][5]);
          break;
        case 7:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4], args[i][5], args[i][6]);
          break;
        case 8:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4], args[i][5], args[i][6], args[i][7]);
          break;
      }

      // Assign the result of the query;
      rows.push(row);
    }
    // Catch any errors
    catch (err) {
      rows.push(null);
    }
  }

  await connection.close();

  return rows;
}

/**
 * Async function that performs one query multiple times on the database, each time with different values. 
 * Must be called from within an async function block and must include the await keyword before the call.
 * @code (async () => { let x = await query('query', ...'args'); })();
 * 
 * @param {string} query SQl query. Can be a basic query with predefined values or a prepared statement 
 * with placeholder ?s for values.
 * @param {*[]} args Array of arrays, with each containing arguments to substitute into the prepared 
 * statement. Must include empty arrays if there are no arguments.
 * @returns {*[]} An array containing the rows affected by each query (could be NULL if that query failed).
 */
async function repeatQuery(query, args) {
  // Create connection to the database
  let connection = new Connection(`mysql://${config.user}:${config.password}@${config.host}/${config.database}`);
  let rows = [];

  try {
    // Prepare the statement
    let statement = connection.prepareStatement(query);

    // Repeat for the number of values provided
    for (let i = 0; i < args.length; i++) {
      let row = null;

      switch (args[i].length) {
        // Do basic query in this case (no parameters)
        case 0:
          row = await statement.query();
          break;
        // All other cases add parameters to the prepared statement
        case 1:
          row = await statement.query(args[i][0]);
          break;
        case 2:
          row = await statement.query(args[i][0], args[i][1]);
          break;
        case 3:
          row = await statement.query(args[i][0], args[i][1], args[i][2]);
          break;
        case 4:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3]);
          break;
        case 5:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4]);
          break;
        case 6:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4], args[i][5]);
          break;
        case 7:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4], args[i][5], args[i][6]);
          break;
        case 8:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4], args[i][5], args[i][6], args[i][7]);
          break;
      }

      // Assign the result of the query;
      rows.push(row);
    }
  }
  // Catch any errors
  catch (err) {
    rows.push(null);
  }

  await connection.close();

  return rows;
}



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
function getUser(username) {
  // Syntax for calling the async query function 
  (async () => {
    try {
      return await singleQuery(SQL_GET_USER, username);
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
      return await singleQuery(SQL_GET_ALL_POSTS_BY_USER, username);
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
      return await singleQuery(SQL_GET_ALL_POSTS);
    }
    catch (error) {
      throw error;
    }
  })();
}


function getAllCommentsOnPost(globalPostID) {

}



/**
 * 
 * @param {*} globalPostID 
 * @returns JSON object with value names "likes" and "dislikes".
 */
function getAllInteractionsOnPost(globalPostID) {
  const SQL = "SELECT COUNT(interaction) AS x FROM LikesDislikesInPost WHERE (postID = ? AND interaction = ?)";

  (async () => {
    let rows = await repeatQuery(SQL, [[globalPostID, "like"], [globalPostID, "dislike"]]);

    let x = {
      likes: rows[0][0].x,
      dislikes: rows[1][0].x,
    };

    return x;
  })();
}


function getAllChannels() {

}

function getAllPostsInChannel() {

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
function createUser(username, password, email, isPublicAccount = true, isAdminAccount = false) {
  let sql = "INSERT INTO User(username, userPassword, emailAddress, isPublic, levelOfAccess, salt) VALUES (?, ?, ?, ?, ?, ?)";

  /* This Will need moved */
  var salt = randomStr((Math.random() * 50) + 10);

  var hash = hashStr(password, salt);
  /* This Will need moved */

  // Syntax for calling the async query function 
  (async () => {
    try {
      let data = await singleQuery(sql, username, hash, email, isPublicAccount, isAdminAccount, salt);
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
      data = await singleQuery(sql, name, description);

      for (let i = 0; i < similarTags.length; i++) {
        try {
          await singleQuery(similarTag, name, similarTags[i]);
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
          await singleQuery(similarTag, name, similarTags[i]);
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
      data = await singleQuery(sql, name, description);

      for (let i = 0; i < similarTags.length; i++) {
        await singleQuery(similarTag, name, similarTags[i]);
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
      data = await singleQuery(sql, accountUsername, usernameToFollow);
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

