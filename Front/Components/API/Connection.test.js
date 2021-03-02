import Connection from "./Connection.js";

const connection = new Connection();

test("test login", async () => {
  try {
    await connection.login("test@test.test", "password");
    expect(true).toBe(true);
  } catch (error) {
    console.log("FAILED TO SIGN IN");
    console.log(error);

    // Fail if we can't sign in
    expect(true).toBe(false);
  }
});

test("test getAllPosts", async () => {
  let x = await connection.getAllPosts();
  expect(x.length).toBeGreaterThan(0);
});

// test("check create TestTag (already should exist)", () => {
//   return connection.createTag("TestTag", "desc", null, ["TestTag2"]).then(x => {
//     expect(x).toBe(x.error);
//   });
// });

// console.log(
//   await connection.createPost(
//     "test title",
//     "TestChannel",
//     "TestUser",
//     null,
//     ["TestTag", "TestTag0"],
//     ["photo1", "photo2"]
//   )
// );

//connection.close();
