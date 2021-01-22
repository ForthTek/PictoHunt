var API = require("./API.js");

// ALL API ASYNC FUNCTIONS MUST BE CALLED FROM WITHIN AN ASYNC BLOCK:
// (async () => { })();

// ALL IMPLEMENTED METHODS:

// TEST GET FUNCTIONS
(async () => {
    // Basic login stuff
    //console.log(await API.isCorrectPassword("solomon", "password"));
    //console.log(await API.isCorrectPassword("solomon", "wrong password"));

    //console.log(await API.isCorrectEmail("solomon", "email"));
    //console.log(await API.isCorrectEmail("solomon", "not email"));

    //console.log(await API.isPublicAccount("sol"));
    //console.log(await API.isPublicAccount("solomon"));


    // Post stuff
    //console.log(await API.getAllPostIDs());
    //console.log(await API.getAllPostIDsByUser("sol"));
    //console.log(await API.getAllPostIDsInChannel("cute animal pics"));

    //console.log(await API.getPost(1));

    //console.log(await API.getNumberOfLikedPosts("sol"));
    //console.log(await API.getNumberOfDislikedPosts("sol"));

    //console.log(await API.getLikedPostIDs("sol"));
    //console.log(await API.getDislikedPostIDs("sol"));

    // Channel stuff
    //console.log(await API.getFollowedChannelNames("sol"));
    //console.log(await API.getAllChannelNames());


    // Tag stuff
    //console.log(await API.getAllTags());
    //console.log(await API.getFollowedTags("sol"));

    // User stuff
    //console.log(await API.getFollowedUsers("sol"));


})();

// TEST CREATE FUNCTIONS
(async () => {
    //console.log(await API.createUser("sol", "password", "email"));

    //console.log(await API.createTag("cat", "pictures of cute cats"));

    //console.log(await API.createTag("dog", "pictures of dogs"));
    //console.log(await API.addSimilarTags("dog", ["Cute animals"]));
    //console.log(await API.createTag("dog", "pictures of dogs", ["Cute animals"]));

    //console.log(await API.createChannel("dogs", "channel for pictures of dogs", "sol"));
    //console.log(await API.addRelatedTagsToChannel("dogs", ["dog", "Cute animals"]));
    //console.log(await API.createChannel("doggos", "channel for pictures of doggos", "sol", ["dog", "Cute animals"]));



    


})();
