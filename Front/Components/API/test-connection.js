const APIClass = require("./API.js");
const API = new APIClass();

(async () => {
  console.log(await API.createTag("TestTag", "desc", null, ["TestTag2"]));
})();

(async () => {
  console.log(
    await API.createPost(
      "test title",
      "TestChannel",
      "TestUser",
      null,
      ["TestTag", "TestTag0"],
      ["photo1", "photo2"]
    )
  );
})();


