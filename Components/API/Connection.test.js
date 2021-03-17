import Connection from "./Connection.js";
import Filter from "./Filter.js";

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
describe("1.0 guest tests", () => {
  beforeAll(async () => {
    await connection.logout();
  });

  test("1.1 guest isLoggedIn", async () => {
    let x = connection.isLoggedIn();
    expect(x).toBe(false);
  });

  test("1.2 guest getAllPosts", async () => {
    let x = await connection.getAllPosts(new Filter());
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

  test("1.3 guest getBrowse", async () => {
    // A guest user viewing browse should see all posts
    const numberOfAllPosts = (await connection.getAllPosts(new Filter())).length;
    const numberOfBrowse = (await connection.getBrowse(new Filter())).length;
    expect(numberOfBrowse).toBe(numberOfAllPosts);
  });
});

// Tests when the user is authenticated
describe("2.0 auth tests", () => {
  beforeAll(async () => {
    await connection.login(TEST_EMAIL, TEST_PASSWORD);
  });

  test("2.1 auth login", async () => {
    await connection.logout();
    let x = await connection.login(TEST_EMAIL, TEST_PASSWORD);
    // If this test fails, the test account could be locked/suspended
    expect(x).toBe(true);
  });

  test("2.2 auth isLoggedIn", async () => {
    expect(connection.isLoggedIn()).toBe(true);
  });

  test("2.3 auth currentUser", async () => {
    let x = connection.currentUser();
    expect(x.email).toBe(TEST_EMAIL);
    expect(x.username).toBe(TEST_USERNAME);
  });

  test("2.4 auth getBrowse", async () => {
    let x = await connection.getBrowse(new Filter());
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

  test("2.5 auth test channel", async () => {
    try {
      await connection.createChannel(TEST_CHANNEL, "just a test channel");
    } catch (error) {}

    let channel = await connection.getChannel(TEST_CHANNEL);
    //console.log(channel)
  });

  test("2.6 auth like", async () => {
    let x = await connection.likePost(TEST_POST);
    // Like, dislike and remove interaction
  });

  test("2.7 auth followUser", async () => {
    await connection.followUser(TEST_USERNAME, true);
  });

  test("2.8 auth followChannel", async () => {
    await connection.followChannel(TEST_CHANNEL, true);
  });

  test("2.9 auth logout", async () => {
    let x = await connection.logout();
    expect(x).toBe(true);
  });
});
