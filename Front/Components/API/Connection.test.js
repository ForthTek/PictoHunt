import Connection from "./Connection.js";

const connection = new Connection();

test("check create TestTag (already should exist)", async () => {
  const x = await connection.createTag("TestTag", "desc", null, ["TestTag2"]);
  console.log(x);
  expect(sum(1, 2)).toBe(3);
});

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
