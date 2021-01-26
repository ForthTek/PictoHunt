var API = require("./API.js");


// ALL API ASYNC FUNCTIONS MUST BE CALLED FROM WITHIN AN ASYNC BLOCK:
// (async () => { })();

// All API functions will return either:
// - a JSON object if there was an error => { error: message } (use this message for feedback to the user)
// - or their return type

// Test example by running "node .\API-example.js"


// Example - load posts on user profile
(async () => {
    let value = await API.getUser("Professional Photography");

    // There was an error
    if (value.error) {
        // Deal with the error - display the code to user?
        console.log(value.error);
    }
    // Return value is valid
    else {
        console.log(`User ${value.username} has score ${value.score}`)

        // Load the most recent post
        if (value.posts.length > 0) {
            let mostRecentPost = await API.getPost(value.posts[0]);

            // Do something with the post
            console.log(mostRecentPost)

            // Maybe you would want to have an array of these post objects 
            // and keep appending new ones as you scroll down the page
            // and load them
        }
        else {
            console.log(`${value.username} hasn't made any posts yet`)
        }
    }
})();

