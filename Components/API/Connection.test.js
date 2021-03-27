import ChallengeTask from "./ChallengeTask.js";
import Connection from "./Connection.js";
import Filter from "./Filter.js";
import Server from "./Server.js";

const TEST_EMAIL = "forthtek1@gmail.com";
const TEST_USERNAME = "Test";
const TEST_PASSWORD = "password";
const TEST_CHANNEL = "Test";

/*

Tests Index
1.0: Guest Tests
2.0: User Tests
3.0: Channel Tests
4.0: Challenge Tests
5.0: Unit Tests

*/

// Create the connection at the start
const connection = new Connection();

afterAll(() => {
  connection.close();
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
    const numberOfAllPosts = (await connection.getAllPosts(new Filter()))
      .length;
    const numberOfBrowse = (await connection.getBrowse(new Filter())).length;
    expect(numberOfBrowse).toBe(numberOfAllPosts);
  });
});

describe("2.0 signed in tests", () => {
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

  describe("2.1 account tests", () => {
    test("currentUser", async () => {
      let x = connection.currentUser();
      expect(x.email).toBe(TEST_EMAIL);
      expect(x.username).toBe(TEST_USERNAME);
    });

    test("2.2 login", async () => {
      await connection.logout();
      await connection.login(TEST_EMAIL, TEST_PASSWORD);
      // If this test fails, the test account could be locked/suspended
    });
  });

  describe("2.3 profile tests", () => {
    test("getProfile", async () => {
      let user = await connection.getProfile(TEST_USERNAME);
      //console.log(user);
    });

    // test("likePost", async () => {
    //   let x = await connection.likePost(TEST_POST);
    //   // Like, dislike and remove interaction
    // });

    test("2.4 followUser", async () => {
      await connection.followUser(TEST_USERNAME, true);
    });

    test("2.5 followChannel", async () => {
      await connection.followChannel(TEST_CHANNEL, true);
    });
  });

  describe("3.0 channel tests", () => {
    test("getChannel", async () => {
      let channel = await connection.getChannel(TEST_CHANNEL);
      //console.log(channel);
    });
  });

  describe("3.1 browse tests", () => {
    beforeEach(async () => {
      await connection.login(TEST_EMAIL, TEST_PASSWORD);
    });

    test("3.2 getGetAllPosts", async () => {
      let x = await connection.getAllPosts();
      //console.log(x.length);
    });

    test("3.3 getBrowse", async () => {
      let x = await connection.getBrowse();
      //console.log(x.length);
    });
  });

  describe("3.4 map tests", () => {
    test("getMap", async () => {
      let x = await connection.getMap();
      //console.log(x.length);
    });
  });

  describe("4.0 challenge tests", () => {
    // test.only("createChallenge", async () => {
    //   let x = await connection.createChallenge(
    //     "photograph two dogs",
    //     new Date("2021-04-17T03:24:00"),
    //     100,
    //     [
    //       new ChallengeTask("picture of a pug", "Test"),
    //       new ChallengeTask("cute golden pls", "Test2", 1, 2),
    //     ]
    //   );
    // });

    const c = "UXlZhJc8sQGub94WGpiR";
    // test.only("inviteUsersToChallenge", async () => {
    //   let x = await connection.inviteUsersToChallenge(c, ["Test"]);
    // });

    // test.only("deleteChallengeRequest", async () => {
    //   let x = await connection.deleteChallenge(c);
    // });

    test("getChallenges", async () => {
      let x = await connection.getChallenges(false);
      //console.log(x);
      // for (let i = 0; i < x[0].tasks.length; i++) {
      //   console.log(x[0].tasks[i]);
      // }
    });
  });

  describe("5.0 admin tests", () => {
    // test.only("getReportedPosts", async () => {
    //   let x = await connection.getAllReportedPosts();
    //   console.log(x.length);
    // });
    // test.only("isAdmin", async () => {
    //   expect(await connection.isAdmin()).toBe(true);
    // });
    // test.only("getSummaryReport", async () => {
    //   console.log(await connection.getSummeryReport());
    // });
    // test.only("createChannel", async () => {
    //   console.log(await connection.createChannel(TEST_CHANNEL, "description here"));
    // });
  });
});

// let server = new Server();
// describe("5.0 signed in tests", () => {
//   describe("5.1 filter tests", () => {
//     test("SwearString", async () => {
//       var swear = "shit";
//       let x = await server.containsSwears(swear);
//       expect(x).toBe(true);
//     });

//     test("NoSwearString", async () => {
//       var noSwear = "test string";
//       let x = await server.containsSwears(noSwear);
//       expect(x).toBe(false);
//     });
//   });
// });

// test.only("create sample data", async () => {
//   try {
//     await connection.createProfile(
//       TEST_EMAIL,
//       TEST_USERNAME,
//       TEST_PASSWORD,
//       false
//     );
//   } catch (error) {}

//   await connection.login(TEST_EMAIL, TEST_PASSWORD);

//   try {
//     await connection.createChannel(
//       "Animals",
//       "Pictures of cute animals. Anything goes!"
//     );
//   } catch (error) {}

//   try {
//     await connection.createChannel("doggos", "cute doggos only!");
//   } catch (error) {}

//   try {
//     await connection.createChannel(
//       "Holiday pictures",
//       "Dedicated to pictures taken on holiday"
//     );
//   } catch (error) {}

//   try {
//     await connection.createChannel("Cities", "Cities from around the world");
//   } catch (error) {}

//   try {
//     await connection.createChallenge(
//       "Weekly challenge",
//       new Date("2021-04-01T00:00:00"),
//       100,
//       [
//         new ChallengeTask("Photograph any animal", "Animals"),
//         new ChallengeTask("Take a picture of a dog", "doggos"),
//       ]
//     );
//   } catch (error) {}

//   try {
//     await connection.createChallenge(
//       "Daily challenge",
//       new Date("2021-03-27T00:00:00"),
//       75,
//       [new ChallengeTask("Take a picture in the city", "Cities")]
//     );
//   } catch (error) {}

//   try {
//     await connection.createChallenge(
//       "Interesting buildings",
//       new Date("2021-03-27T00:00:00"),
//       150,
//       [
//         new ChallengeTask("Photograph a tall building", "Cities"),
//         new ChallengeTask("Take a pic of an interesting building", "Cities"),
//         new ChallengeTask(
//           "Take a snap of a damaged building",
//           "Holiday pictures"
//         ),
//       ]
//     );
//   } catch (error) {}
// });
