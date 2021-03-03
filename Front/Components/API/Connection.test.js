import Connection from "./Connection.js";

const TEST_EMAIL = "forthtek1@gmail.com";
const TEST_USERNAME = "Test";
const TEST_PASSWORD = "password";

// Create the connection at the start
const connection = new Connection();

beforeAll(async () => {
  // Ensure the account already exists
  let result = await connection.createProfile(
    TEST_EMAIL,
    TEST_USERNAME,
    TEST_PASSWORD,
    false
  );

  if(!result.success) {
    //console.log(result.error);
  }

  // Then log out
  await connection.logout();
});

// Tests when the user is a guest
describe("guest tests", () => {
  beforeAll(async () => {
    await connection.logout();
  });

  // test("guest getAllPosts", async () => {
  //   let x = await connection.getAllPosts();
  //   expect(x.length).toBeGreaterThan(0);
  // });

  test("guest getBrowse", async () => {
    // A guest user viewing browse should see all posts
    const numberOfAllPosts = (await connection.getAllPosts()).length;
    const numberOfBrowse = (await connection.getBrowse()).length;
    expect(numberOfBrowse).toBe(numberOfAllPosts);
  });
});

// Tests when the user is authenticated
describe("auth tests", () => {
  beforeAll(async () => {
    await connection.logout();
  });

  test("auth login", async () => {
    let x = await connection.login(TEST_EMAIL, TEST_PASSWORD);

    // If this test fails, the test account could be locked/suspended
    // Print the message if there is one
    if (!x.success) {
      console.log(x.error);
    }

    expect(x.success).toBe(true);
  });
  
  test("auth isLoggedIn", async () => {
    let x = connection.isLoggedIn();
    expect(x).toBe(true);
  });

  test("auth currentUser", async () => {
    let x = connection.currentUser();
    expect(x.email).toBe(TEST_EMAIL);
    expect(x.username).toBe(TEST_USERNAME);
  });

  test("auth getBrowse", async () => {
    let x = await connection.getBrowse();
    expect(x.length).toBeGreaterThan(0);
  });

  // test("auth createPost", async () => {
  //   await connection.login(TEST_EMAIL, TEST_PASSWORD);
  //   let postID = await connection.createPost(
  //     "my new post",
  //     "TestChannel",
  //     null,
  //     ["TestTag"],
  //     ["./photos/dog1.jpg"]
  //   );
  //   console.log(`uploaded new post ${postID}`);
  //   //expect(x.length).toBeGreaterThan(0);
  // });

  test("auth logout", async () => {
    let x = await connection.logout();

    // If this test fails, the test account could be locked/suspended
    // Print the message if there is one
    if (!x.success) {
      console.log(x.error);
    }

    expect(x.success).toBe(true);
  });
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
