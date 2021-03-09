import Connection from "./Connection.js";

const TEST_EMAIL = "forthtek1@gmail.com";
const TEST_USERNAME = "Test";
const TEST_PASSWORD = "password";

const TEST_CHANNEL = "Test";

const TEST_POST = "PSIFLk7xHyKpK50HqTdh";

// Create the connection at the start
const connection = new Connection();

beforeAll(async () => {
  try {
    // Ensure the account already exists
    await connection.createProfile(
      TEST_EMAIL,
      TEST_USERNAME,
      TEST_PASSWORD,
      false
    );
  } catch (error) {}

  // Then log out
  await connection.logout();
});

// Tests when the user is a guest
describe("guest tests", () => {
  beforeAll(async () => {
    await connection.logout();
  });

  test("guest isLoggedIn", async () => {
    let x = connection.isLoggedIn();
    expect(x).toBe(false);
  });

  test("guest getAllPosts", async () => {
    let x = await connection.getAllPosts();
    expect(x.length).toBeGreaterThan(0);
  });

  // test("guest getAllPosts", async () => {
  //   let x = await connection.getAllPosts();
  //   expect(x.length).toBeGreaterThan(0);
  // });

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
    await connection.login(TEST_EMAIL, TEST_PASSWORD);
  });

  test("auth login", async () => {
    await connection.logout();
    let x = await connection.login(TEST_EMAIL, TEST_PASSWORD);
    // If this test fails, the test account could be locked/suspended
    expect(x).toBe(true);
  });

  test("auth isLoggedIn", async () => {
    expect(connection.isLoggedIn()).toBe(true);
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

  // Dont test this as we cant upload images from here
  // test("auth createPost", async () => {
  //   await connection.login(TEST_EMAIL, TEST_PASSWORD);
  //   let postID = await connection.createPost(
  //     "my new post",
  //     "TestChannel",
  //     null,
  //     ["TestTag"],
  //     []
  //   );
  //   console.log(`uploaded new post ${postID}`);
  //   //expect(x.length).toBeGreaterThan(0);
  // });

  test("auth test channel", async () => {
    try {
      await connection.createChannel(TEST_CHANNEL, "just a test channel");
    } catch (error) {}

    let channel = await connection.getChannel(TEST_CHANNEL);
    //console.log(channel)
  });

  test("auth interactWithPost", async () => {
    const type = connection.PostInteractionType.like;
    let x = await connection.interactWithPost(TEST_POST, type);
    //expect(x.length).toBeGreaterThan(0);
  });

  test("auth logout", async () => {
    let x = await connection.logout();
    expect(x).toBe(true);
  });
});
