const express = require("express")
const bodyParser = require("body-parser")
const api = require("./API")

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/api/hello", (req, res) => {
    res.send({ express: "Hello From Express" })
})

const USERNAME = "Professional Photography"

app.get("/api/getUser", (req, res) => {
    ;(async () => {
        let value = await api.getUser(USERNAME)

        // There was an error
        if (value.error) {
            // Deal with the error
            console.log(value.error)
        }
        // Return value is valid
        else {
            // Load all the user's posts
            for (let i = 0; i < value.posts.length; i++) {
                value.posts[i] = await api.getPost(value.posts[i])
            }
        }

        res.send(value.posts[0])
    })()
})

app.get("/api/getBrowse", (req, res) => {
    ;(async () => {
        let value = await api.getPostsFromAllFollowedFeeds(USERNAME)

        // There was an error
        if (value.error) {
            console.log(value.error)
            return value
        }
        // Return value is valid
        else {
            // Load all the posts into an array
            let posts = []
            for (let i = 0; i < value.length; i++) {
                posts.push(await api.getPost(value[i]))
            }
            console.log(posts)

            res.send(posts)
        }
    })()
})

app.post("/api/world", (req, res) => {
    console.log(req.body)
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`
    )
})

app.listen(port, () => console.log(`Listening on port ${port}`))
