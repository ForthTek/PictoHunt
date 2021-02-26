var API = require("./API.js");

const TEST_USER = "Professional Photography";

// TEST SOME FUNCTIONS
(async () => {
    // Basic login stuff

    // Post stuff
    //console.log(await API.getAllPostIDs());
    //console.log(await API.getAllPostIDsByUser("sol"));
    //console.log(await API.getAllPostIDsInChannel("cute animal pics"));

    //console.log(await API.getPost(17));



    //console.log(await API.getNumberOfLikedPosts("sol"));
    //console.log(await API.getNumberOfDislikedPosts("sol"));

    //console.log(await API.getLikedPostIDs("sol"));
    //console.log(await API.getDislikedPostIDs("sol"));

    // Channel stuff
    //console.log(await API.getFollowedChannelNames("Professional Photography"));
    //console.log(await API.getAllChannelNames());
    //console.log(await API.getFollowedChannelNames("Professional Photography"));


    // Tag stuff
    //console.log(await API.getAllTags());




    //console.log(await API.createUser("solomon", "password", "sol@email.address"));
    //console.log(await API.createUser("ryan", "secure password", "ryan@email.address"));


    //console.log(await API.createTag("cat", "pictures of cute cats"));
    //console.log(await API.createTag("cat", "pictures of cute cats"));
    //console.log(await API.getTag("cat"));
    //console.log(await API.getTag("ca"));

    //console.log(await API.createTag("dog", "pictures of dogs"));
    //console.log(await API.addSimilarTags("dog", ["Cute animals"]));
    //console.log(await API.createTag("dog", "pictures of dogs", ["Cute animals"]));

    //console.log(await API.createChannel("dogs", "channel for pictures of dogs", "sol"));
    //console.log(await API.addRelatedTagsToChannel("dogs", ["dog", "Cute animals"]));
    //console.log(await API.createChannel("doggos", "channel for pictures of doggos", "sol", ["dog", "Cute animals"]));


    //console.log(await API.createPost("new post", "sol", "dogs", ["1", "2", "3"], ["dog", "Cute animals"]));
    //console.log(await API.createComment(17, "sol", "this is a comment"));

    // TEST likes, dislikes and removing interaction
    //console.log(await API.interactWithPost(16, "solomon", API.PostInteractionTypes.dislike));
    //console.log(await API.interactWithPost(15, "sol", API.PostInteractionTypes.like));
    //console.log(await API.interactWithPost(16, "sol", API.PostInteractionTypes.removeInteraction));

    //console.log(await API.followChannel("solomon", "dogs"));
    //console.log(await API.followTag("solomon", "dog"));
    //console.log(await API.followUser("solomon", "sol"));





    //console.log(await API.getNumberOfLikedPosts(TEST_USER));
    //console.log(await API.getNumberOfDislikedPosts(TEST_USER));
    //console.log(await API.getLikedPostIDs(TEST_USER));
    //console.log(await API.getDislikedPostIDs(TEST_USER));



    //console.log(await API.getAllPostsWithLocation());

    //console.log(await API.getUsersRankedByScore());

    //console.log(await API.getFollowedTags(TEST_USER));
    //console.log(await API.getFollowedUsers(TEST_USER));
    //console.log(await API.getPostsFromAllFollowedFeeds(TEST_USER));
    //console.log(await API.getPost(80));

    //console.log(await API.getDailyChallenge());

})();
