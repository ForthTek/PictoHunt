var API = require("./API.js");
var RandomWord = require("random-words");

const TAGS = [
    "animal", "pet", "dog", "cat", "cow", "bird", "cute", "funny",
    "architecture", "modern-architecture", "historic-architecture", "history", "city",
    "holiday",
];

const USERS = [
    "Professional Photography", "Joe Bloggs", "John Smith"
];

const CHANNELS = [
    { name: "London", tags: ["city"] },
    { name: "Holiday Pictures", tags: ["city"] },
    { name: "Animals", tags: ["animal"] },
    { name: "Pets", tags: ["pet", "animal", "cute"] },
    { name: "Architecture", tags: ["architecture", "modern-architecture", "historic-architecture"] },
];

const POSTS = [
    { photos: ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/ben1.jpg"], tags: ["architecture", "historic-architecture", "city"] },
    { photos: ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/ben2.jpg"], tags: ["architecture", "historic-architecture", "city"] },
    { photos: ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/ben3.jpg"], tags: ["city", "holiday", "architecture"] },
    { photos: ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/ben4.jpg"], tags: ["city", "holiday"] },
    { photos: ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Architecture/modern.jpg"], tags: ["architecture", "modern-architecture"] },
    { photos: ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/e1.jpg"], tags: ["animal", "holiday"] },
    { photos: ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/e2.jpg"], tags: ["animal", "holiday"] },
    { photos: ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/e3.jpg"], tags: ["animal", "holiday"] },
    { photos: ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/e4.jpg"], tags: ["animal", "holiday"] },
    { photos: ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/dog1.jpg"], tags: ["animal", "pet", "dog"] },
    { photos: ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/dog2.jpg"], tags: ["pet", "dog", "cute"] },
    { photos: ["https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/dog3.jpg"], tags: ["animal", "pet", "dog", "cute"] },
];


(async () => {
    await populateDatabase();
})()

async function populateDatabase() {

    // Create tags with random description
    for (let i = 0; i < TAGS.length; i++) {
        let x = await API.createTag(TAGS[i], RandomDescription());
        console.log(x);
    }


    // Create users
    for (let i = 0; i < USERS.length; i++) {
        let x = await API.createUser(USERS[i], `${USERS[i]}password`, `${USERS[i]}@email.address`);
        console.log(x);
    }

    // Create channels by random user and random description
    for (let i = 0; i < CHANNELS.length; i++) {
        let randomUser = Math.floor(Math.random() * USERS.length);
        let x = await API.createChannel(CHANNELS[i].name, RandomDescription(), USERS[randomUser], CHANNELS[i].tags);
        console.log(x);
    }

    let allPostIDs = [];
    // Create posts by random user and random title
    for (let i = 0; i < POSTS.length; i++) {

        let randomUser = Math.floor(Math.random() * USERS.length);
        let randomChannel = Math.floor(Math.random() * CHANNELS.length);

        // 50% chance to have a random location
        let lat = null, long = null;
        if (Math.random() < 0.5) {
            lat = Math.random * 180 - 90;
            long = Math.random * 360 - 180;
        }

        let ID = await API.createPost(RandomPostTitle(), USERS[randomUser], CHANNELS[randomChannel].name, POSTS[i].photos, POSTS[i].tags, lat, long);
        allPostIDs.push(ID);

        console.log(ID);
    }

    // Users interact with things
    for (let j = 0; j < USERS.length; j++) {

        // Follow tags
        for (let i = 0; i < TAGS.length; i++) {
            if (Math.random() < 0.2) {
                let x = await API.followTag(USERS[j], TAGS[i]);
                if(!x.error) {
                    console.log("USER FOLLOWED TAG");
                }
                console.log(x);
            }
        }

        // Follow users
        for (let i = 0; i < USERS.length; i++) {
            if (Math.random() < 0.2) {
                let x = await API.followUser(USERS[j], USERS[i]);
                if(!x.error) {
                    console.log("USER FOLLOWED USER");
                }
                console.log(x);
            }
        }

        // Follow channels
        for (let i = 0; i < CHANNELS.length; i++) {
            if (Math.random() < 0.2) {
                let x = await API.followChannel(USERS[j], CHANNELS[i].name);
                if(!x.error) {
                    console.log("USER FOLLOWED CHANNEL");
                }
                console.log(x);
            }
        }

        // Interact with post
        for (let i = 0; i < allPostIDs.length; i++) {
            if (Math.random() < 0.5) {

                let interaction = API.PostInteractionTypes.like;
                // Chance to like or dislike
                if (Math.random() < 0.2) {
                    interaction = API.PostInteractionTypes.dislike;
                }

                // Interact with the post
                let x = await API.interactWithPost(allPostIDs[i], USERS[i], interaction);

                if(!x.error) {
                    console.log("USER INTERACTED");
                }

                if (Math.random() < 0.5) {
                    x = await API.createComment(allPostIDs[i], USERS[i], RandomComment());

                    if(!x.error) {
                        console.log("USER COMMENTED");
                    }
                }
            }
        }
    }
}



function RandomPostTitle() {
    return RandomWord({ min: 1, max: 3, join: " " })
}

function RandomComment() {
    return RandomWord({ min: 2, max: 8, join: " " })
}

function RandomDescription() {
    return RandomWord({ min: 3, max: 12, join: " " })
}



