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
    console.log(await API.createChannel("Architecture", "Architecture - any", "Professional Photography", ["architecture", "modern-architecture", "historic-architecture"]));


    // Follow things
    console.log(await API.followUser("Joe Bloggs", "Professional Photography"));
    console.log(await API.followUser("Joe Bloggs", "John Smith"));
    console.log(await API.followUser("John Smith", "Professional Photography"));
    console.log(await API.followUser("John Smith", "Joe Bloggs"));
    console.log(await API.followUser("Professional Photography", "Joe Bloggs"));


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


    /*
    // Create posts
    let post1 = await API.createPost("Big Ben and the Palace of Westminster", "Professional Photography", "London", ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/ben1.jpg", "https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/ben2.jpg"], ["architecture", "historic-architecture", "city"], 51.510357, -0.116773);
    let post2 = await API.createPost("Big Ben at night", "Professional Photography", "London", ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/ben4.jpg"], ["architecture", "historic-architecture", "city"], 51.510357, -0.116773);
    let post3 = await API.createPost("A pic from my holiday in London", "Joe Bloggs", "Holiday Pictures", ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/ben3.jpg"], ["architecture", "historic-architecture", "city", "holiday"], 51.510357, -0.116773);

    let post4 = await API.createPost("modern", "Professional Photography", "Architecture", ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/modern.jpg"], ["architecture", "modern-architecture"]);

    let post5 = await API.createPost("Safari pics", "Professional Photography", "Holiday Pictures", ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/e1.jpg", "https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/e2.jpg", "https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/e3.jpg"], ["animal", "holiday"], 5.464497, 9.071827);
    let post6 = await API.createPost("Holiday pic from last year", "Joe Bloggs", "Holiday Pictures", ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/e4.jpg"], ["animal", "holiday"], 5.466131, 9.069080);

    let post7 = await API.createPost("What a cutie!", "John Smith", "Pets", ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/dog1.jpg"], ["animal", "pet", "dog", "cute"]);
    let post8 = await API.createPost("He is the cutest boy!", "John Smith", "Pets", ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/dog2.jpg"], ["animal", "pet", "dog", "cute"]);
    let post9 = await API.createPost("The best doggo!", "John Smith", "Pets", ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/dog3.jpg"], ["animal", "pet", "dog"]);


    // Add some interactions
    console.log(await API.interactWithPost(post3, "Professional Photography", API.PostInteractionTypes.like));
    console.log(await API.interactWithPost(post6, "Professional Photography", API.PostInteractionTypes.like));
    console.log(await API.interactWithPost(post7, "Professional Photography", API.PostInteractionTypes.like));
    console.log(await API.interactWithPost(post8, "Professional Photography", API.PostInteractionTypes.like));

    console.log(await API.interactWithPost(post1, "Joe Bloggs", API.PostInteractionTypes.like));
    console.log(await API.interactWithPost(post2, "Joe Bloggs", API.PostInteractionTypes.like));
    console.log(await API.interactWithPost(post5, "Joe Bloggs", API.PostInteractionTypes.like));
    console.log(await API.interactWithPost(post8, "Joe Bloggs", API.PostInteractionTypes.like));
    console.log(await API.interactWithPost(post9, "Joe Bloggs", API.PostInteractionTypes.like));

    console.log(await API.interactWithPost(post1, "John Smith", API.PostInteractionTypes.like));
    console.log(await API.interactWithPost(post2, "John Smith", API.PostInteractionTypes.like));
    console.log(await API.interactWithPost(post6, "John Smith", API.PostInteractionTypes.like));
    console.log(await API.interactWithPost(post5, "John Smith", API.PostInteractionTypes.like));

    console.log(await API.interactWithPost(post4, "John Smith", API.PostInteractionTypes.dislike));
    console.log(await API.interactWithPost(post4, "Joe Bloggs", API.PostInteractionTypes.dislike));

    // Create comments
    console.log(await API.createComment(post3, "Professional Photography", "Great shot!"));
    console.log(await API.createComment(post7, "Professional Photography", "Such a cute dog!"));

    console.log(await API.createComment(post1, "Joe Bloggs", "Cracking picture mate"));
    console.log(await API.createComment(post2, "Joe Bloggs", "Nice one"));
    console.log(await API.createComment(post8, "Joe Bloggs", "What a cute doggo"));

    console.log(await API.createComment(post5, "John Smith", "wow! great shots!"));
    console.log(await API.createComment(post6, "John Smith", "lovely"));
    console.log(await API.createComment(post1, "John Smith", "great picture"));
    */

    console.log("Added new data to the database.");
})();

