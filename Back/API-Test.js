const APIClass = require("./API.js");
const API = new APIClass();

(async () => {
  console.log(
    await API.createPost(
      "test title",
      "test channel",
      "test user",
      "GPS value",
      ["tag1", "tag2"],
      ["photo1", "photo2"]
    )
  );
})();
