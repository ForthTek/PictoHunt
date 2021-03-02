import Connection from "./Connection.js";

const TEST_EMAIL = "forthtek1@gmail.com";
const TEST_PASSWORD = "password";

const connection = new Connection();

test("test login", async () => {
  let x = await connection.login(TEST_EMAIL, TEST_PASSWORD);

  // If this test fails, the test account could be locked/suspended
  // Print the message if there is one
  if (!x.success) {
    console.log(x.error);
  }

  expect(x.success).toBe(true);
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
