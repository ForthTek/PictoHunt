import Connection from "./Connection";

function run() {

  console.log("RUNNING API TEST");

  const connection = new Connection();

  (async () => {
    console.log(
      await connection.createTag("TestTag", "desc", null, ["TestTag2"])
    );

    console.log(
      await connection.createPost(
        "test title",
        "TestChannel",
        "TestUser",
        null,
        ["TestTag", "TestTag0"],
        ["photo1", "photo2"]
      )
    );
  })();
}
