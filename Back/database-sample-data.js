var API = require("./API.js");

const TAGS = [
    "animal", "pet", "dog", "cat", "cow", "bird", "cute", "funny",
    "architecture", "modern-architecture", "historic-architecture", "history", "city",
    "holiday",
];

// POPULATE THE DATABASE
(async () => {

    // Create all tags
    for (let i = 0; i < TAGS.length; i++) {
        console.log(await API.createTag(TAGS[i], "This is the description of the tag"));
    }
    //PI.addSimilarTags("", "");


    // Create users
    console.log(await API.createUser("Professional Photography", "password", "professional@email.address"));
    console.log(await API.createUser("Joe Bloggs", "password1", "joe@email.address"));
    console.log(await API.createUser("John Smith", "password2", "john@email.address"));

    // Create channels 
    console.log(await API.createChannel("London", "Pictures taken in the city of London, England.", "Professional Photography", ["city"]));
    console.log(await API.createChannel("Holiday Pictures", "Pictures taken on holiday. Wherever that may be!", "Joe Bloggs"));
    console.log(await API.createChannel("Animals", "Pictures of animals.", "John Smith", ["animal"]));
    console.log(await API.createChannel("Pets", "Household pet pictures.", "John Smith", ["pet", "animal", "cute"]));


    // Follow things
    console.log(await API.followUser("Joe Bloggs", "Professional Photography"));
    console.log(await API.followUser("Joe Bloggs", "John Smith"));
    console.log(await API.followUser("John Smith", "Professional Photography"));
    console.log(await API.followUser("John Smith", "Joe Bloggs"));

    console.log(await API.followChannel("Joe Bloggs", "London"));
    console.log(await API.followChannel("Joe Bloggs", "Holiday Pictures"));
    console.log(await API.followChannel("John Smith", "London"));
    console.log(await API.followChannel("John Smith", "Animals"));
    console.log(await API.followChannel("John Smith", "Pets"));
    console.log(await API.followChannel("Professional Photography", "London"));
    console.log(await API.followChannel("Professional Photography", "Pets"));

    console.log(await API.followTag("Joe Bloggs", "architecture"));
    console.log(await API.followTag("Joe Bloggs", "modern-architecture"));
    console.log(await API.followTag("Joe Bloggs", "city"));
    console.log(await API.followTag("John Smith", "animal"));
    console.log(await API.followTag("John Smith", "dog"));
    console.log(await API.followTag("John Smith", "cat"));
    console.log(await API.followTag("John Smith", "cute"));
    console.log(await API.followTag("Professional Photography", "architecture"));
    console.log(await API.followTag("Professional Photography", "modern-architecture"));
    console.log(await API.followTag("Professional Photography", "city"));
    console.log(await API.followTag("Professional Photography", "history"));
    console.log(await API.followTag("Professional Photography", "animal"));

    // Create posts
    //console.log(await API.createPost("new post", "sol", "dogs", ["1", "2", "3"], ["dog", "Cute animals"]));



    // Create comments
    //console.log(await API.createComment(17, "sol", "this is a comment"));





    console.log("Added new data to the database.");
})();

