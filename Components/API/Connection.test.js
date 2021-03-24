import ChallengeTask from "./ChallengeTask.js";
import Connection from "./Connection.js";
import Filter from "./Filter.js";

const TEST_EMAIL = "forthtek1@gmail.com";
const TEST_USERNAME = "Test";
const TEST_PASSWORD = "password";
const TEST_CHANNEL = "Test";

// Create the connection at the start
const connection = new Connection();

afterAll(() => {
  connection.close();
});

describe("signed out tests", () => {
  beforeAll(async () => {
    await connection.logout();
  });

  test("isLoggedIn", async () => {
    await connection.login(TEST_EMAIL, TEST_PASSWORD);
    expect(connection.isLoggedIn()).toBe(true);
    await connection.logout();
    expect(connection.isLoggedIn()).toBe(false);
  });
});

describe("signed in tests", () => {
  beforeAll(async () => {
    try {
      await connection.createProfile(
        TEST_EMAIL,
        TEST_USERNAME,
        TEST_PASSWORD,
        false
      );
    } catch (error) {}

    try {
      await connection.createChannel(TEST_CHANNEL, "just a test channel");
    } catch (error) {}

    await connection.login(TEST_EMAIL, TEST_PASSWORD);
  });

  describe("account tests", () => {
    test("currentUser", async () => {
      let x = connection.currentUser();
      expect(x.email).toBe(TEST_EMAIL);
      expect(x.username).toBe(TEST_USERNAME);
    });

    test("login", async () => {
      await connection.logout();
      await connection.login(TEST_EMAIL, TEST_PASSWORD);
      // If this test fails, the test account could be locked/suspended
    });

    describe("profile tests", () => {
      test("getProfile", async () => {
        let user = await connection.getProfile(TEST_USERNAME);
        //console.log(user);
      });

      // test("likePost", async () => {
      //   let x = await connection.likePost(TEST_POST);
      //   // Like, dislike and remove interaction
      // });

      test("auth followUser", async () => {
        await connection.followUser(TEST_USERNAME, true);
      });

      test("auth followChannel", async () => {
        await connection.followChannel(TEST_CHANNEL, true);
      });
    });

    describe("channel tests", () => {
      test("auth test channel", async () => {
        let channel = await connection.getChannel(TEST_CHANNEL);
        //console.log(channel);
      });
    });

    describe("browse tests", () => {
      beforeEach(async () => {
        await connection.login(TEST_EMAIL, TEST_PASSWORD);
      });

      test("auth getGetAllPosts", async () => {
        let x = await connection.getAllPosts();
        //console.log(x.length);
      });

      test("auth getBrowse", async () => {
        let x = await connection.getBrowse();
        //console.log(x.length);
      });
    });

    describe("map tests", () => {
      test("auth getMap", async () => {
        let x = await connection.getMap();
        //console.log(x.length);
      });
    });

    describe("challenge tests", () => {
      // test.only("auth createChallenge", async () => {
      //   let x = await connection.createChallenge(
      //     "photograph two dogs",
      //     new Date("2021-04-17T03:24:00"),
      //     100,
      //     [new ChallengeTask("Test"), new ChallengeTask("Test2", 1, 2)]
      //   );
      // });

      const c = "KuATRbhU2WWVDLyJigDM";
      // test.only("inviteUsersToChallenge", async () => {
      //   let x = await connection.inviteUsersToChallenge(c, ["Test"]);
      // });

      test.only("getChallenges", async () => {
        let x = await connection.getChallenges(false);
        console.log(x);
        // for (let i = 0; i < x[0].tasks.length; i++) {
        //   console.log(x[0].tasks[i]);
        // }
      });
    });
  });
});
