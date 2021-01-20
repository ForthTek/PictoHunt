var API = require("./API.js");


(async () => {
    console.log(await API.getUser("solomon"));

    console.log(await API.getAllInteractionsOnPost(1));

    console.log(await API.isCorrectPassword("solomon", "password"));

    console.log(await API.getAllCommentsFromPost(1));
    console.log(await API.getAllTagsFromPost(1));
    console.log(await API.getAllImagesFromPost(1));

})()


