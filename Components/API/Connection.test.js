import Connection from "./Connection.js";

// This is a basic account login
const TEST_EMAIL = "forthtek1@gmail.com";
const TEST_PASSWORD = "password";
const TEST_USERNAME = "Test";
const TEST_CHANNEL = "Test";

// Put in admin login details here when running the tests
const ADMIN_EMAIL = "";
const ADMIN_PASSWORD = "";

/*
Tests Index
1.0: Auth tests
2.0: Profile tests
3.0: Admin tests
4.0: Channel tests
5.0: Browse tests
6.0: Map tests
7.0: Challenge tests
*/

describe("Connection.js tests", () => {
  var connection;

  // Global test setup
  beforeAll(async () => {
    connection = new Connection();

    await connection
      .createProfile(TEST_EMAIL, TEST_USERNAME, TEST_PASSWORD, false)
      .catch((error) => {});

    await connection.login(TEST_EMAIL, TEST_PASSWORD);
  });

  // Global test teardown
  afterAll(() => {
    connection.close();
  });

  describe("1.0 auth tests", () => {
    test("1.1 login", async () => {
      await connection.logout();
      await connection.login(TEST_EMAIL, TEST_PASSWORD);
      // If this test fails, the test account could be locked/suspended
    });

    describe("1.2 account tests", () => {
      test("currentUser", async () => {
        let x = connection.currentUser();
        expect(x.email).toBe(TEST_EMAIL);
        expect(x.username).toBe(TEST_USERNAME);
      });

      test("1.3 isLoggedIn", async () => {
        expect(connection.isLoggedIn()).toBe(true);
      });
    });
  });

  describe("2.0 profile tests", () => {
    test("2.1 getProfile", async () => {
      let user = await connection.getProfile(TEST_USERNAME);
      //console.log(user);
    });

    test("2.2 followUser", async () => {
      await connection.followUser(TEST_USERNAME, true);
    });

    test("2.3 followChannel", async () => {
      await connection.followChannel(TEST_CHANNEL, true);
    });
  });

  describe("3.0 admin tests", () => {
    beforeAll(async () => {
      if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        throw new Error(`Must define admin login details`);
      }

      await connection.login(ADMIN_EMAIL, ADMIN_PASSWORD);

      await connection
        .createChannel(TEST_CHANNEL, "description here")
        .catch((error) => {});
    });

    test("3.1 isAdmin", async () => {
      expect(await connection.isAdmin()).toBe(true);
    });

    test("3.2 getReportedPosts", async () => {
      let x = await connection.getAllReportedPosts();
      // console.log(`reported posts: ${x.length}`);
    });

    test("3.3 getAllHiddenPosts", async () => {
      let x = await connection.getAllHiddenPosts();
      // console.log(`hidden posts: ${x.length}`);
    });

    test("3.4 getSummaryReport", async () => {
      let x = await connection.getSummaryReport();
      // console.log(x);
    });
  });

  describe("4.0 channel tests", () => {
    beforeAll(async () => {
      await connection.login(TEST_EMAIL, TEST_PASSWORD);
    });

    test("4.1 getChannel", async () => {
      let x = await connection.getChannel(TEST_CHANNEL);
    });
  });

  describe("5.1 browse tests", () => {
    beforeAll(async () => {
      await connection.login(TEST_EMAIL, TEST_PASSWORD);
    });

    test("5.2 getGetAllPosts", async () => {
      let x = await connection.getAllPosts();
    });

    test("5.3 getBrowse", async () => {
      let x = await connection.getBrowse();
    });
  });

  describe("6.0 map tests", () => {
    test("6.1 getMap", async () => {
      let x = await connection.getMap();
      //console.log(x.length);
    });
  });

  describe("7.0 challenge tests", () => {
    beforeAll(async () => {
      await connection.login(TEST_EMAIL, TEST_PASSWORD);
    });

    test("7.1 getChallenges", async () => {
      let x = await connection.getChallenges(false);
    });

    test("7.2 getChallenges", async () => {
      let x = await connection.getChallenges(true);
    });
  });
});
