// https://en.wikipedia.org/wiki/JSDoc
// JavaScriptDoc conventions

var Database = require("./database.js")
var InputValidation = require("./Components/input-validation.js")
var HashCode = require("./Components/murmurhash-js/murmurhash3_gc.js")
var Random = require("./Components/seedrandom.js")

const { throws } = require("assert")
var Database = require("./database.js")

/**
 * Enum for identifying the type of an interaction with a post.
 */
const PostInteractionTypes = Object.freeze({
    like: 1,
    dislike: 2,
    removeInteraction: 3,
})

// ALL FUNCTIONS THAT INTERACT WITH THE DATABASE MUST BE CALLED FROM WITHIN AN ASYNC BLOCK:
// (async () => { ... })();

// CHECK THE API-example.js FILE FOR FULL EXAMPLES

function getErrorMessage(error) {
    // Just for now
    // Will need to do custom messages for errors
    let message = error.message

    // This allows error detection in the form
    /*
  if(x.error) {
    // Deal with error
  }
  else {
    // Deal with data
  }
  */

    return { error: message }
}

async function getDailyChallenge() {
    try {
        const today = new Date()
        const seed = HashCode.murmurhash3_32_gc(
            `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`
        )
        const r = new Random(seed)

        const MAX_TAGS = 3
        let numberOfTags = clamp(Math.floor(r() * MAX_TAGS), 1, MAX_TAGS)

        const SQL = "SELECT name FROM Tag;"
        let allTags = await Database.singleQuery(SQL)

        let tags = []
        for (let i = 0; i < numberOfTags; i++) {
            let randomIndex = Math.floor(r() * allTags.length)
            let tag = allTags[randomIndex].name

            tags.push(tag)
        }

        return tags
    } catch (error) {
        return getErrorMessage(error)
    }
}

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max)
}

// Check methods

async function usernameAlreadyTaken(username) {}

async function emailAlreadyTaken(email) {}

/**
 * Async function that evaluates if the sign in details are correct.
 *
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {boolean} True or error object.
 */
async function isValidSignInDetails(username, email, password) {
    const SQL =
        "SELECT username, emailAddress, salt, userPassword FROM User WHERE username = ?"

    try {
        let rows = await Database.singleQuery(SQL, username)

        // Throw a useful error if the username is invalid
        try {
            rows[0].username
        } catch (e) {
            throw new Error("Username is not valid")
        }

        console.log(rows[0].emailAddress)

        // Email is invalid
        if (email !== rows[0].emailAddress) {
            throw new Error("Email address is not valid")
        }

        let hash = InputValidation.hashStr(password, rows[0].salt)

        // Password is invalid
        if (hash !== rows[0].userPassword) {
            throw new Error("Password is not valid")
        }

        return true
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that returns if an account is public or not.
 *
 * @param {string} username
 * @returns {boolean} True or error object.
 */
async function isPublicAccount(username) {
    const SQL = "SELECT username, isPublic FROM User WHERE username = ?"

    try {
        let rows = await Database.singleQuery(SQL, username)

        // Throw a useful error if the username is invalid
        try {
            rows[0].username
        } catch (e) {
            throw new Error("Username is not valid")
        }

        return rows[0].isPublic === 1
    } catch (error) {
        return getErrorMessage(error)
    }
}

// Get methods

/**
 * Async function that returns a User's profile.
 *
 * @param {string} username
 * @returns {object} User object or error object.
 * @returns {string} user.username
 * @returns {number} user.score
 * @returns {number[]} user.posts Array of post IDs
 * @returns {boolean} user.isPublic
 * @returns {timestamp} user.joined Timestamp when user created account
 */
async function getUser(username) {
    const EXISTS =
        "SELECT username, isPublic, timeJoined FROM User WHERE username = ?"
    const SCORE =
        "SELECT SUM(score) AS score FROM Post WHERE posterAccount = ?;"
    const POSTS =
        "SELECT globalPostID FROM Post WHERE posterAccount = ? ORDER BY globalPostID DESC;"

    try {
        let rows = await Database.multiQuery(
            [EXISTS, SCORE, POSTS],
            [[username], [username], [username]]
        )

        // Throw a useful error if the username doesn't exist
        try {
            rows[0][0].username
        } catch (e) {
            throw new Error("Account username is not valid")
        }

        // Convert to an array of integers
        let posts = []
        for (let i = 0; i < rows[2].length; i++) {
            posts.push(rows[2][i].globalPostID)
        }

        return {
            username: rows[0][0].username,
            isPublic: rows[0][0].isPublic,
            joined: rows[0][0].timeJoined,
            score: rows[1][0].score,
            posts: posts,
        }
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that returns a Channel's profile.
 *
 * @param {string} name
 * @returns {object} Channel object or error object.
 * @returns {string} channel.name
 * @returns {number} channel.score
 * @returns {number[]} channel.posts Array of post IDs
 */
async function getChannel(name) {
    const EXISTS = "SELECT name FROM Channel WHERE name = ?"
    const SCORE = "SELECT SUM(score) AS score FROM Post WHERE postedTo = ?;"
    const POSTS =
        "SELECT globalPostID FROM Post WHERE postedTo = ? ORDER BY globalPostID DESC;"

    try {
        let rows = await Database.multiQuery(
            [EXISTS, SCORE, POSTS],
            [[name], [name], [name]]
        )

        // Throw a useful error if the username doesn't exist
        try {
            rows[0][0].name
        } catch (e) {
            throw new Error("Channel name is not valid")
        }

        // Convert to an array of integers
        let posts = []
        for (let i = 0; i < rows[2].length; i++) {
            posts.push(rows[2][i].globalPostID)
        }

        return {
            name: name,
            score: rows[1][0].score,
            posts: posts,
        }
    } catch (error) {
        return getErrorMessage(error)
    }
}

async function getChannelsWithTag(tag) {
    const SQL =
        "SELECT channelName FROM TagsInChannel WHERE tagName = ? GROUP BY channelName;"

    try {
        let rows = await Database.singleQuery(SQL, tag)

        let channels = []
        for (let i = 0; i < rows.length; i++) {
            channels.push(rows[i].channelName)
        }

        return channels
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that gets a list of every single post ID.
 *
 * @returns {number[]} ID's sorted by newest first.
 */
async function getAllPostIDs() {
    const SQL = "SELECT globalPostID FROM Post ORDER BY globalPostID DESC;"

    try {
        let rows = await Database.singleQuery(SQL)
        return JSON.parse(JSON.stringify(rows))
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that returns all posts that have a GPS location.
 * @returns {object[]} Array of objects or error object
 * @returns {number} post.ID
 * @returns {number} post.GPSLatitude
 * @returns {number} post.GPSLongitude
 * @returns {string} post.icon
 */
async function getAllPostsWithLocation() {
    const SQL =
        "SELECT Post.globalPostID AS ID, Post.GPSLongitude, Post.GPSLatitude, PhotosInPost.photoURL AS icon FROM Post " +
        "JOIN PhotosInPost ON PhotosInPost.postID = Post.globalPostID " +
        "WHERE (Post.GPSLongitude IS NOT NULL AND Post.GPSLatitude IS NOT NULL) " +
        "GROUP BY Post.globalPostID ORDER BY Post.globalPostID DESC, PhotosInPost.orderInPost ASC;"

    try {
        let rows = await Database.singleQuery(SQL)
        return JSON.parse(JSON.stringify(rows))
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that returns a list of all users and their corresponding score.
 * @returns {object[]} Array of user objects or error object
 * @returns {string} user.username
 * @returns {number} user.score
 */
async function getUsersRankedByScore() {
    const SQL =
        "SELECT User.username, SUM(Post.score) AS score FROM User " +
        "JOIN Post ON Post.posterAccount = User.username " +
        "GROUP BY User.username " +
        "ORDER BY score DESC;"

    try {
        let rows = await Database.singleQuery(SQL)
        return JSON.parse(JSON.stringify(rows))
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that returns a post.
 *
 * @param {number} globalPostID ID of the post to return.
 * @returns {object} A Post object or error object.
 * @returns {number} post.ID
 * @returns {string} post.title
 * @returns {string} post.user
 * @returns {string} post.channel
 * @returns {number} post.likes
 * @returns {number} post.dislikes
 * @returns {timestamp} post.time
 * @returns {number} post.GPSLatitude
 * @returns {number} post.GPSLongitude
 * @returns {string[]} post.tags Array of strings
 * @returns {string[]} post.photos Array of string URLs
 * @returns {Comment[]} post.comments Array of comment objects
 * @returns {string} post.comments[i].user
 * @returns {string} post.comments[i].text
 * @returns {timestamp} post.comments[i].time Timestamp
 */
async function getPost(globalPostID) {
    const POST = "SELECT * FROM Post WHERE globalPostID = ?;"
    const TAGS = "SELECT tagName FROM TagsInPost WHERE postID = ?;"
    const IMAGES =
        "SELECT photoURL FROM PhotosInPost WHERE postID = ? ORDER BY orderInPost;"
    const COMMENTS =
        "SELECT commentText, commentAccount, commentTime FROM CommentsInPost WHERE postID = ? ORDER BY globalCommentID DESC;"
    const INTERACTIONS =
        "SELECT COUNT(interaction) AS x FROM LikesDislikesInPost WHERE (postID = ? AND interaction = ?)"

    try {
        // Get all of the data from the post
        let rows = await Database.multiQuery(
            [POST, TAGS, IMAGES, INTERACTIONS, INTERACTIONS, COMMENTS],
            [
                [globalPostID],
                [globalPostID],
                [globalPostID],
                [globalPostID, "like"],
                [globalPostID, "dislike"],
                [globalPostID],
            ]
        )

        /*
    console.log("RAW DATA:")
    console.log(rows);
    console.log("\n")
    */

        // Throw a useful error if the post doesn't exist
        try {
            rows[0][0].postID
        } catch (e) {
            throw new Error("Post does not exist")
        }

        // Now we need to process the data

        // Convert tags to an array of strings
        let tags = []
        for (let i = 0; i < rows[1].length; i++) {
            tags.push(rows[1][i].tagName)
        }
        // Convert photos to array of URLs
        let photos = []
        for (let i = 0; i < rows[2].length; i++) {
            photos.push(rows[2][i].photoURL)
        }

        // Convert comments to array of comment objects
        let comments = []
        for (let i = 0; i < rows[5].length; i++) {
            comments.push({
                user: rows[5][i].commentAccount,
                text: rows[5][i].commentText,
                time: rows[5][i].commentTime,
            })
        }

        // Now return the object
        let post = {
            ID: globalPostID,
            title: rows[0][0].title,
            user: rows[0][0].posterAccount,
            channel: rows[0][0].postedTo,
            score: rows[0][0].score,
            likes: rows[3][0].x,
            dislikes: rows[4][0].x,
            time: rows[0][0].timeOfPost,
            GPSLatitude: rows[0][0].GPSLatitude,
            GPSLongitude: rows[0][0].GPSLongitude,
            tags: tags,
            photos: photos,
            comments: comments,
        }

        return post
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that returns a Tag.
 *
 * @param {string} name
 * @returns {object} Tag object or error object.
 * @returns {string} tag.name
 * @returns {string} tag.description
 */
async function getTag(name) {
    const SQL = "SELECT name, description FROM Tag WHERE name = ?;"

    try {
        let rows = await Database.singleQuery(SQL, name)

        // Throw a useful error if the post doesn't exist
        try {
            rows[0].name
        } catch (e) {
            throw new Error("Tag name does not exist")
        }

        return {
            name: name,
            description: rows[0].description,
        }
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that returns all Channel names followed by the user.
 *
 * @param {string} username
 * @returns {string[]} Array of Channel names.
 */
async function getFollowedChannelNames(username) {
    const SQL =
        "SELECT channelName FROM UserFollowingChannel WHERE username = ?;"

    try {
        let rows = await Database.singleQuery(SQL, username)

        // Convert to an array of strings
        let channels = []
        for (let i = 0; i < rows.length; i++) {
            channels.push(rows[i].channelName)
        }

        return channels
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that returns all Channel names.
 *
 * @returns {string[]} Array containing all Channel names.
 */
async function getAllChannelNames() {
    const SQL = "SELECT name FROM Channel;"

    try {
        let rows = await Database.singleQuery(SQL)
        // Convert to an array of strings
        let channels = []
        for (let i = 0; i < rows.length; i++) {
            channels.push(rows[i].name)
        }

        return channels //
    } catch (error) {
        return getErrorMessage(error)
    }
}

async function getAllChannels() {
    const SQL = "SELECT * FROM Channel;"

    try {
        let rows = await Database.singleQuery(SQL)

        return rows //
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that returns all Tag names followed by the user.
 *
 * @param {string} username
 * @returns {string[]} Array of Tag names.
 */
async function getFollowedTags(username) {
    const SQL = "SELECT tag FROM UserFollowingTag WHERE username = ?;"

    try {
        let rows = await Database.singleQuery(SQL, username)
        // Convert to an array of strings
        let tags = []
        for (let i = 0; i < rows.length; i++) {
            tags.push(rows[i].tag)
        }

        return tags
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that returns all Tag names.
 *
 * @returns {string[]} Array of all Tag names.
 */
async function getAllTagNames() {
    const SQL = "SELECT name FROM Tag;"

    try {
        let rows = await Database.singleQuery(SQL)
        // Convert to an array of strings
        let tags = []
        for (let i = 0; i < rows.length; i++) {
            tags.push(rows[i].name)
        }

        return tags
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that returns all usernames that the user is following.
 *
 * @param {string} username
 * @returns {string[]} Array of usernames.
 */
async function getFollowedUsers(username) {
    const SQL =
        "SELECT userBeingFollowed AS user FROM UserFollowingUser WHERE username = ?;"

    try {
        let rows = await Database.singleQuery(SQL, username)
        // Convert to an array of strings
        let users = []
        for (let i = 0; i < rows.length; i++) {
            users.push(rows[i].user)
        }

        return users
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that returns a list of all posts from feeds followed.
 *
 * @param {string} username
 * @returns {number[]} List of post IDs, sorted by most recent first
 */
async function getPostsFromAllFollowedFeeds(username) {
    // Get posts from followed channels and users
    const SQL =
        "SELECT Post.globalPostID FROM Post " +
        "JOIN UserFollowingUser ON UserFollowingUser.userBeingFollowed = Post.posterAccount " +
        "JOIN UserFollowingChannel ON UserFollowingChannel.channelName = Post.postedTo " +
        "WHERE UserFollowingUser.username = ? OR UserFollowingChannel.username = ? " +
        "GROUP BY Post.globalPostID ORDER BY Post.globalPostID DESC;"

    // Get posts from followed tags
    const TAG =
        "SELECT Post.globalPostID FROM Post " +
        "JOIN TagsInPost ON TagsInPost.postID = Post.globalPostID " +
        "JOIN UserFollowingTag ON TagsInPost.tagName = UserFollowingTag.tag " +
        "WHERE UserFollowingTag.username = ? " +
        "GROUP BY Post.globalPostID ORDER BY Post.globalPostID DESC;"

    // All three combined - not quite working yet
    const COMBINED =
        "SELECT Post.globalPostID FROM Post " +
        "JOIN TagsInPost ON TagsInPost.postID = Post.globalPostID " +
        "JOIN UserFollowingTag ON UserFollowingTag.tag = TagsInPost.tagName " +
        "JOIN UserFollowingUser ON UserFollowingUser.userBeingFollowed = Post.posterAccount " +
        "JOIN UserFollowingChannel ON UserFollowingChannel.channelName = Post.postedTo " +
        "WHERE (UserFollowingUser.username = ? OR UserFollowingChannel.username = ? OR UserFollowingTag.username = ?) " +
        "GROUP BY Post.globalPostID ORDER BY Post.globalPostID DESC;"

    try {
        let rows = await Database.singleQuery(SQL, username, username)

        // Convert to an array of post IDs
        let posts = []
        for (let i = 0; i < rows.length; i++) {
            posts.push(rows[i].globalPostID)
        }

        return posts
    } catch (error) {
        return getErrorMessage(error)
    }
}

async function getNumberOfPostInteractions(username, postInteractionType) {
    const SQL =
        "SELECT COUNT(postID) AS x FROM LikesDislikesInPost WHERE (likeAccount = ? AND interaction = ?);"

    let value = ""
    switch (postInteractionType) {
        case PostInteractionTypes.like:
            value = "like"
            break
        case PostInteractionTypes.dislike:
            value = "dislike"
            break
    }

    try {
        let rows = await Database.singleQuery(SQL, username, value)
        return rows[0].x
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 *
 * @param {string} username
 * @returns {number}
 */
async function getNumberOfLikedPosts(username) {
    return await getNumberOfPostInteractions(
        username,
        PostInteractionTypes.like
    )
}

/**
 *
 * @param {string} username
 * @returns {number}
 */
async function getNumberOfDislikedPosts(username) {
    return await getNumberOfPostInteractions(
        username,
        PostInteractionTypes.dislike
    )
}

async function getPostsInteractedWith(username, postInteractionType) {
    const SQL =
        "SELECT postID FROM LikesDislikesInPost WHERE (likeAccount = ? AND interaction = ?);"

    let value = ""
    switch (postInteractionType) {
        case PostInteractionTypes.like:
            value = "like"
            break
        case PostInteractionTypes.dislike:
            value = "dislike"
            break
    }

    try {
        let rows = await Database.singleQuery(SQL, username, value)
        return rows[0].postID
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 *
 * @param {string} username
 * @returns {number[]}
 */
async function getLikedPostIDs(username) {
    return await getPostsInteractedWith(username, PostInteractionTypes.like)
}

/**
 *
 * @param {string} username
 * @returns {number[]}
 */
async function getDislikedPostIDs(username) {
    return await getPostsInteractedWith(username, PostInteractionTypes.dislike)
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
 */
async function createUser(
    username,
    password,
    email,
    isPublicAccount = true,
    isAdminAccount = false
) {
    const sql =
        "INSERT INTO User(username, userPassword, emailAddress, isPublic, levelOfAccess, salt, timeJoined) VALUES (?, ?, ?, ?, ?, ?, NOW())"

    try {
        // Invalid username?
        if (false) {
            throw new Error("Username is not valid")
        }

        /** @TODO Move validation to front end */

        // Invalid email
        if (!InputValidation.isEmailValidFormat(email)) {
            //throw new Error(`Email address ${email} is not valid`);
        }

        // Invalid password
        if (!InputValidation.isPasswordValidFormat(password)) {
            //throw new Error("Password is not valid");
        }

        return true
    } catch (error) {
        return getErrorMessage(error)
    }
    /* This Will need moved */
    var salt = InputValidation.randomStr(Math.random() * 50 + 10)
    /* This Will need moved */
    var hash = InputValidation.hashStr(password, salt)

    let public = 0
    if (isPublicAccount) {
        public = 1
    }

    let admin = "user"
    if (isAdminAccount) {
        admin = "admin"
    }
}

/**
 *
 * @param {*} name
 * @param {*} description
 * @param  {string[]} similarTags Optional string array of similar tags to this tag.
 */
async function createTag(name, description, similarTags = null) {
    const TAG = "INSERT INTO Tag(name, description) VALUES(?, ?);"

    try {
        // Create the tag
        await Database.singleQuery(TAG, name, description)

        if (similarTags != null && similarTags.length > 0) {
            // Add similar tags
            await addSimilarTags(name, similarTags)
        }

        return true
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 *
 * @param {string} name
 * @param {string[]} similarTags
 */
async function addSimilarTags(name, similarTags) {
    const SIMILAR = "INSERT INTO SimilarTags(tag, similarTag) VALUES(?, ?);"

    if (similarTags.length > 0) {
        let args = []
        for (let i = 0; i < similarTags.length; i++) {
            args.push([name, similarTags[i]])
        }

        try {
            // Add similar tags
            await Database.repeatQuery(SIMILAR, args)
            return true
        } catch (error) {
            return getErrorMessage(error)
        }
    }
}

/**
 *
 * @param {string} name
 * @param {string} description
 * @param {string} usernameCreatedBy
 * @param {string[]} relatedTags Optional string array of tags associated to this channel
 */
async function createChannel(
    name,
    description,
    usernameCreatedBy,
    relatedTags = null
) {
    const CHANNEL =
        "INSERT INTO Channel(name, description, createdBy) VALUES(?, ?, ?);"

    try {
        // Create the channel
        await Database.singleQuery(
            CHANNEL,
            name,
            description,
            usernameCreatedBy
        )

        // Add the related tags to this channel
        if (relatedTags != null && relatedTags.length > 0) {
            await addRelatedTagsToChannel(name, relatedTags)
        }

        return true
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 *
 * @param {string} channel
 * @param {string[]} relatedTags
 */
async function addRelatedTagsToChannel(channel, relatedTags) {
    const TAGS = "INSERT INTO TagsInChannel(channelName, tagName) VALUES(?, ?)"

    if (relatedTags.length > 0) {
        let args = []
        for (let i = 0; i < relatedTags.length; i++) {
            args.push([channel, relatedTags[i]])
        }

        try {
            // Add similar tags
            await Database.repeatQuery(TAGS, args)
            return true
        } catch (error) {
            return getErrorMessage(error)
        }
    }
}

/**
 *
 * @param {string} title
 * @param {string} accountUsername
 * @param {string} channelNamePostedTo
 * @param {string[]} photos URLs of photos, sorted by order in post.
 * @param {string[]} tags Names of tags in post.
 * @param {number} GPSLatitude (optional or just set null)
 * @param {number} GPSLongitude (optional or just set null)
 * @returns {number} The new ID of the post, or error object
 */
async function createPost(
    title,
    accountUsername,
    channelNamePostedTo,
    photos,
    tags,
    GPSLatitude = null,
    GPSLongitude = null
) {
    const SQL =
        "INSERT INTO Post(title, posterAccount, postedTo, timeOfPost, GPSLatitude, GPSLongitude) VALUES(?, ?, ?, NOW(), ?, ?);"
    const GET_POST_ID =
        "SELECT MAX(globalPostID) AS x FROM Post WHERE posterAccount = ?"
    const PHOTOS =
        "INSERT INTO PhotosInPost(postID, photoURL, orderInPost) VALUES(?, ?, ?);"
    const TAGS = "INSERT INTO TagsInPost(postID, tagName) VALUES(?, ?);"

    try {
        // Create the post
        await Database.singleQuery(
            SQL,
            title,
            accountUsername,
            channelNamePostedTo,
            GPSLatitude,
            GPSLongitude
        )
        // Get the most recent post by the user
        const POST_ID = (
            await Database.singleQuery(GET_POST_ID, accountUsername)
        )[0].x

        // Add the photos
        let photoArgs = []
        for (let i = 0; i < photos.length; i++) {
            photoArgs.push([POST_ID, photos[i], i])
        }
        await Database.repeatQuery(PHOTOS, photoArgs)

        // Add the tags
        let tagArgs = []
        for (let i = 0; i < tags.length; i++) {
            tagArgs.push([POST_ID, tags[i]])
        }

        await Database.repeatQuery(TAGS, tagArgs)
        return POST_ID
    } catch (error) {
        return getErrorMessage(error)
    }
}

async function createComment(postID, accountUsername, comment) {
    const SQL =
        "INSERT INTO CommentsInPost(postID, commentAccount, commentText, commentTime) VALUES(?, ?, ?, NOW());"

    try {
        await Database.singleQuery(SQL, postID, accountUsername, comment)
        return true
    } catch (error) {
        return getErrorMessage(error)
    }
}

async function interactWithPost(postID, accountUsername, interactionType) {
    const DELETE =
        "DELETE FROM LikesDislikesInPost WHERE (postID = ? AND likeAccount = ?);"
    const UPDATE =
        "UPDATE LikesDislikesInPost SET interaction = ? WHERE (postID = ? AND likeAccount = ?);"
    const INSERT =
        "INSERT INTO LikesDislikesInPost(postID, likeAccount, interaction) VALUES(?, ?, ?);"

    const SCORE =
        "SELECT Count(interaction) FROM LikesDislikesInPost WHERE (interaction = 'like' AND postID = ?)"
    const UPDATE_SCORE =
        "UPDATE Post SET score = (" + SCORE + ") WHERE globalPostID = ?"

    try {
        // Remove the interaction instead
        if (interactionType === PostInteractionTypes.removeInteraction) {
            await Database.multiQuery(
                [DELETE, UPDATE_SCORE],
                [
                    [postID, accountUsername],
                    [postID, postID],
                ]
            )
            return true
        }
        // Set the interaction
        else {
            let value
            if (interactionType === PostInteractionTypes.like) {
                value = "like"
            } else if (interactionType === PostInteractionTypes.dislike) {
                value = "dislike"
            } else {
                throw new Error("Interaction type is invalid")
            }

            // Try to insert the value
            try {
                await Database.multiQuery(
                    [INSERT, UPDATE_SCORE],
                    [
                        [postID, accountUsername, value],
                        [postID, postID],
                    ]
                )
                return true
            } catch (err) {
                // Update the value instead
                await Database.multiQuery(
                    [UPDATE, UPDATE_SCORE],
                    [
                        [value, postID, accountUsername],
                        [postID, postID],
                    ]
                )
                return true
            }
        }
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that allows a user to follow a Channel.
 *
 * @param {string} accountUsername
 * @param {string} channelName
 * @returns {boolean} True or error object.
 */
async function followChannel(accountUsername, channelName) {
    const SQL =
        "INSERT INTO UserFollowingChannel(username, channelName) VALUES(?, ?);"

    try {
        await Database.singleQuery(SQL, accountUsername, channelName)
        return true
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that allows a user to follow a Tag.
 *
 * @param {string} accountUsername
 * @param {string} tagName
 * @returns {boolean} True or error object.
 */
async function followTag(accountUsername, tagName) {
    const SQL = "INSERT INTO UserFollowingTag(username, tag) VALUES(?, ?);"

    try {
        await Database.singleQuery(SQL, accountUsername, tagName)
        return true
    } catch (error) {
        return getErrorMessage(error)
    }
}

/**
 * Async function that allows a user to follow another user.
 *
 * @param {string} accountUsername
 * @param {string} usernameToFollow
 * @returns {boolean} True or error object.
 */
async function followUser(accountUsername, usernameToFollow) {
    const SQL =
        "INSERT INTO UserFollowingUser(username, userBeingFollowed) VALUES(?, ?);"

    try {
        if (accountUsername === usernameToFollow) {
            throw new Error("User cannot follow themselves")
        }

        await Database.singleQuery(SQL, accountUsername, usernameToFollow)
        return true
    } catch (error) {
        return getErrorMessage(error)
    }
}

// Set methods

async function setAccountPublic(username, trueFalse) {}

// Remove methods

// Export all the functions that should be used
module.exports = {
    PostInteractionTypes,
    // Check functions
    isValidSignInDetails,
    isPublicAccount,
    // Post
    getPost,
    getAllPostIDs,
    getAllPostsWithLocation,
    getPostsFromAllFollowedFeeds,
    getNumberOfLikedPosts,
    getNumberOfDislikedPosts,
    getLikedPostIDs,
    getDislikedPostIDs,
    // Channels
    getChannel,
    getAllChannelNames,
    getChannelsWithTag,
    getAllChannels,
    // Tags
    getTag,
    getAllTagNames,
    // Users
    getUser,
    getUsersRankedByScore,
    // Following
    getFollowedUsers,
    getFollowedTags,
    getFollowedChannelNames,

    // Create functions
    createUser,
    createTag,
    addSimilarTags,
    createChannel,
    addRelatedTagsToChannel,
    createPost,
    createComment,
    interactWithPost,

    followChannel,
    followTag,
    followUser,
}
