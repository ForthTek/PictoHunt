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
    var user = async () => {
        let IDs = await api.getPostsFromAllFollowedFeeds(
            "Professional Photography"
        );

        let posts = [];
        for (let i = 0; i < IDs.length; i++) {
            posts.push(await api.getPost(IDs[i]));
        }

        console.log(posts);
    };

    res.send(user);
});

app.post("/api/world", (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
