import Server from "./Server.js";

describe("server tests", () => {
  var server;

  // Create connection to the server
  beforeAll(async () => {
    server = new Server();
  });

  describe("1.0 filter tests", () => {
    test("1.1 containsSwear", async () => {
      const test = "shit";
      expect(await server.containsSwears(test)).toBe(true);
    });

    test("1.2 containsSwear", async () => {
      const test = "not a swear";
      expect(await server.containsSwears(test)).toBe(false);
    });

    test("1.3 filterSwears", async () => {
      let test = "this is a rude fucking string";
      expect(await server.containsSwears(test)).toBe(true);
      test = await server.filterSwears(test);
      expect(await server.containsSwears(test)).toBe(false);
    });
  });
});
