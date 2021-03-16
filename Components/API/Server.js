import "isomorphic-fetch";

const ADDRESS = "https://pictohunt-server.herokuapp.com";

export default class Server {
  constructor() {
    this.pingServer();
  }

  async pingServer() {
    fetch(`${ADDRESS}/api/uptime`)
      .then((res) => res.text())
      .then((text) => {
        console.log(`Server is online with an uptime of ${text}`);
      })
      .catch((error) => {
        console.log(`Failed pinging the server with error:`);
        console.log(error);
      });
  }

  async updatePostValues(postID) {
    return await fetch(`${ADDRESS}/api/updatePost/${postID}`)
      .then((res) => res.text())
      .then(
        (text) => {
          return true;
        },
        (error) => {
          console.log(error);
          throw new Error(`Server failed to update post ${postID}`);
        }
      );
  }

  async containsSwears(sentence) {
    return await fetch(`${ADDRESS}/api/isValidString/${sentence}`).then(
      async (res) => {
        return (await res.text()).toLowerCase() === "false";
      },
      (error) => {
        console.log(error);
        throw new Error(`Server failed to check swears for string ${sentence}`);
      }
    );
  }

  async filterSwears(sentence) {
    return await fetch(`${ADDRESS}/api/filterString/${sentence}`).then(
      async (res) => {
        return await res.text();
      },
      (error) => {
        console.log(error);
        throw new Error(
          `Server failed to filter swears for string ${sentence}`
        );
      }
    );
  }
}
