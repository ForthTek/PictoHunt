var API = require("./API.js");
var RandomWord = require("random-words");

const TAGS = [
    "animal", "pet", "dog", "pug", "cat", "duck", "panda", "cow", "bird", "cute", "funny", "butterfly", "chicken", "elephant", "flamingo", "deer",
];

const USERS = [
    "Professional Photography", "Joe Bloggs", "John Smith", "Katy Thatcher", "Henry Weston", "Best Photography",
    "alt-account", "Superiour Photos",
];

const CHANNELS = [
    { name: "Animals", tags: ["animal", "cute"] },
    { name: "Pets", tags: ["pet", "animal", "cute"] },
    { name: "Cats", tags: ["animal", "cat"] },
    { name: "Dogs", tags: ["animal", "dog"] },
];

const URL = "https://www2.macs.hw.ac.uk/~sb169/PictoHunt/SamplePhotos/Animals/"

// Photos taken from:
// https://unsplash.com/license
const POSTS = [
    { names: ["bird.jpg"], tags: ["animal", "bird"] },
    { names: ["bird1.jpg"], tags: ["animal", "bird"] },
    { names: ["butterfly.jpg"], tags: ["animal", "butterfly"] },
    { names: ["cat1.jpg"], tags: ["animal", "pet", "cat"] },
    { names: ["cat2.jpg"], tags: ["animal", "pet", "cat"] },
    { names: ["cat3.jpg"], tags: ["animal", "pet", "cat", "cute"] },
    { names: ["cat4.jpg"], tags: ["animal", "pet", "cat", "cute"] },
    { names: ["cat5.jpg"], tags: ["animal", "pet", "cat", "cute"] },
    { names: ["cat6.jpg"], tags: ["animal", "pet", "cat"] },
    { names: ["cat7.jpg"], tags: ["animal", "pet", "cat"] },
    { names: ["cat8.jpg"], tags: ["animal", "pet", "cat"] },
    { names: ["cat9.jpg"], tags: ["animal", "pet", "cat", "cute"] },
    { names: ["cat10.jpg"], tags: ["animal", "pet", "cat", "cute"] },
    { names: ["cat11.jpg"], tags: ["animal", "pet", "cat"] },
    { names: ["cat12.jpg"], tags: ["animal", "pet", "cat"] },
    { names: ["cat13.jpg"], tags: ["animal", "pet", "cat", "cute"] },
    { names: ["cat14.jpg"], tags: ["animal", "pet", "cat", "cute"] },
    { names: ["cat15.jpg"], tags: ["animal", "pet", "cat"] },
    { names: ["cat15.jpg"], tags: ["animal", "pet", "cat"] },
    { names: ["chickens.jpg"], tags: ["animal", "chicken"] },
    { names: ["cow.jpg"], tags: ["animal", "cow"] },
    { names: ["cow2.jpg"], tags: ["animal", "cow"] },
    { names: ["cow3.jpg"], tags: ["animal", "cow", "cute"] },
    { names: ["cow4.jpg"], tags: ["animal", "cow", "cute"] },
    { names: ["cows.jpg"], tags: ["animal", "cow"] },
    { names: ["deer.jpg"], tags: ["animal", "deer"] },
    { names: ["deer2.jpg"], tags: ["animal", "deer"] },
    { names: ["dog.jpg"], tags: ["animal", "pet", "dog"] },
    { names: ["dog1.jpg"], tags: ["animal", "pet", "dog"] },
    { names: ["dog2.jpg"], tags: ["animal", "pet", "dog"] },
    { names: ["dog3.jpg"], tags: ["animal", "pet", "dog"] },
    { names: ["dog4.jpg"], tags: ["animal", "pet", "dog"] },
    { names: ["dog5.jpg"], tags: ["animal", "pet", "dog"] },
    { names: ["dog6.jpg"], tags: ["animal", "pet", "dog"] },
    { names: ["duck.jpg"], tags: ["animal", "duck", "cute"] },
    { names: ["duck2.jpg"], tags: ["animal", "duck", "cute"] },
    { names: ["duck3.jpg"], tags: ["animal", "duck"] },
    { names: ["duck4.jpg"], tags: ["animal", "duck"] },
    { names: ["eagle.jpg"], tags: ["animal"] },
    { names: ["elephant.jpg"], tags: ["animal", "elephant"] },
    { names: ["elephant1.jpg"], tags: ["animal", "elephant"] },
    { names: ["elephants.jpg"], tags: ["animal", "elephant"] },
    { names: ["elk.jpg"], tags: ["animal"] },
    { names: ["flamingo.jpg"], tags: ["animal", "flamingo"] },
    { names: ["flamingos.jpg"], tags: ["animal", "flamingo"] },
    { names: ["foxes.jpg"], tags: ["animal", "cute"] },
    { names: ["frog.jpg"], tags: ["animal"] },
    { names: ["giraffe.jpg"], tags: ["animal"] },
    { names: ["goat.jpg"], tags: ["animal"] },
    { names: ["gorilla.jpg"], tags: ["animal"] },
    { names: ["hamster.jpg"], tags: ["animal", "cute"] },
    { names: ["horses.jpg"], tags: ["animal"] },
    { names: ["jay.jpg"], tags: ["animal", "bird"] },
    { names: ["kingfisher.jpg"], tags: ["animal", "bird"] },
    { names: ["lion.jpg"], tags: ["animal"] },
    { names: ["lions.jpg"], tags: ["animal"] },
    { names: ["lizard.jpg"], tags: ["animal"] },
    { names: ["meercat.jpg"], tags: ["animal"] },
    { names: ["monkey.jpg"], tags: ["animal"] },
    { names: ["monkey2.jpg"], tags: ["animal"] },
    { names: ["monkey3.jpg"], tags: ["animal"] },
    { names: ["panda.jpg"], tags: ["animal"] },
    { names: ["panda2.jpg"], tags: ["animal"] },
    { names: ["parrot.jpg"], tags: ["animal", "bird"] },
    { names: ["pug.jpg"], tags: ["animal", "pug", "cute"] },
    { names: ["red-panda.jpg"], tags: ["animal", "cute"] },
    { names: ["rhino.jpg"], tags: ["animal"] },
    { names: ["sheep.jpg"], tags: ["animal"] },
    { names: ["sheep2.jpg"], tags: ["animal"] },
    { names: ["sheep2.jpg"], tags: ["animal"] },
    { names: ["snail.jpg"], tags: ["animal"] },
    { names: ["squirrel.jpg"], tags: ["animal", "cute"] },
    { names: ["swan.jpg"], tags: ["animal"] },
    { names: ["tiger.jpg"], tags: ["animal"] },
    { names: ["turtle.jpg"], tags: ["animal"] },
    { names: ["zebra.jpg"], tags: ["animal"] },

    { names: ["multiple-dog1.jpg", "multiple-dog2.jpg", "multiple-dog3.jpg"], tags: ["animal", "pet", "dog", "cute"] },
    { names: ["multiple-elephant1.jpg", "multiple-elephant2.jpg", "multiple-elephant3.jpg"], tags: ["animal", "elephant"] },
    { names: ["multiple-elephants1.jpg", "multiple-elephants2.jpg"], tags: ["animal", "elephant"] },
    { names: ["multiple-pug1.jpg", "multiple-pug2.jpg"], tags: ["animal", "dog", "pet", "pug", "cute"] },
];




(async () => {
    //await populateDatabase();
})();

async function populateDatabase() {
    // Create tags with random description
    for (let i = 0; i < TAGS.length; i++) {
        let x = await API.createTag(TAGS[i], RandomDescription());
        console.log(x);
    }

    // Create users
    for (let i = 0; i < USERS.length; i++) {
        let x = await API.createUser(USERS[i], `${USERS[i]}passWORD1`, `email${i}@fake.email.address`);
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

        //Chance to have a random location
        let lat = null, long = null;
        if (Math.random() < 0.75) {
            lat = Math.random() * 180 - 90;
            long = Math.random() * 360 - 180;
        }

        let photos = [];
        for (let j = 0; j < POSTS[i].names.length; j++) {
            photos.push(URL + POSTS[i].names[j]);
        }

        // Get all possible channels to post to
        let allChannels = [];
        for (let x = 0; x < POSTS[i].tags.length; x++) {
            let channels = await API.getChannelsWithTag(POSTS[i].tags[x]);
            allChannels = allChannels.concat(channels);
        }
        //console.log(allChannels);
        let randomChannel = Math.floor(Math.random() * allChannels.length);
        let channel = allChannels[randomChannel];

        let ID = await API.createPost(RandomPostTitle(), USERS[randomUser], channel, photos, POSTS[i].tags, lat, long);
        if (ID.error) {
            console.log(`ERROR when creating post by user ${USERS[randomUser]} in channel ${channel} with photos:`);
            console.log(ID.error);
        }
        else {
            allPostIDs.push(ID);

            console.log(`Creating post ${ID} by user ${USERS[randomUser]} in channel ${channel} with photos:`);
            for (let j = 0; j < photos.length; j++) {
                console.log(photos[j]);
            }
        }
    }

    console.log(`*Created ${allPostIDs.length} posts`);

    // Users interact with things
    for (let j = 0; j < USERS.length; j++) {

        // Follow tags
        for (let i = 0; i < TAGS.length; i++) {
            if (Math.random() < 0.4) {
                let x = await API.followTag(USERS[j], TAGS[i]);
                if (!x.error) {
                    console.log(`User ${USERS[j]} followed tag ${TAGS[i]}`);
                }
                console.log(x);
            }
        }

        // Follow users
        for (let i = 0; i < USERS.length; i++) {
            if (Math.random() < 0.5) {
                let x = await API.followUser(USERS[j], USERS[i]);
                if (!x.error) {
                    console.log(`User ${USERS[j]} followed user ${USERS[i]}`);
                }
                console.log(x);
            }
        }

        // Follow channels
        for (let i = 0; i < CHANNELS.length; i++) {
            if (Math.random() < 0.5) {
                let x = await API.followChannel(USERS[j], CHANNELS[i].name);
                if (!x.error) {
                    console.log(`User ${USERS[j]} followed channel ${CHANNELS[i].name}`);
                }
                console.log(x);
            }
        }

        // Interact with post
        for (let i = 0; i < allPostIDs.length; i++) {
            if (Math.random() < 0.5) {

                let interaction = API.PostInteractionTypes.like;
                // Chance to dislike
                if (Math.random() < 0.3) {
                    interaction = API.PostInteractionTypes.dislike;
                }

                // Interact with the post
                let x = await API.interactWithPost(allPostIDs[i], USERS[j], interaction);

                if (x.error) {
                    console.log(x.error)
                }
                else {
                    console.log(`User ${USERS[j]} interacted with post ${allPostIDs[i]}`);
                }

                if (Math.random() < 0.5) {
                    x = await API.createComment(allPostIDs[i], USERS[j], RandomComment());

                    if (x.error) {
                        console.log(x.error)
                    }
                    else {
                        console.log(`User ${USERS[j]} commented on post ${allPostIDs[i]}`);
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



