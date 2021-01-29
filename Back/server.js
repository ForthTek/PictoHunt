const express = require("express");
const bodyParser = require("body-parser");
const api = require("./API");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/hello", (req, res) => {
    res.send({ express: "Hello From Express" });
});

app.get("/api/getUser", (req, res) => {
    (async () => {

        let value = await api.getUser("Professional Photography");

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
                let mostRecentPost = await api.getPost(value.posts[0]);


                res.send(mostRecentPost);

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




});

app.post("/api/world", (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
