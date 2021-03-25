import "isomorphic-fetch";

const ADDRESS = "https://pictohunt-server.herokuapp.com";
const SERVER_ERROR = 400;

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

  async tryFetchForPost(address) {
    return await fetch(address).then(async (res) => {
      if (res.status >= SERVER_ERROR) {
        const status = await res.text();
        console.log("Server error:");
        console.log(status);
        throw new Error(`Server failed to update post`);
      } else {
        res.text();
        return true;
      }
    });
  }

  async updatePostValues(postID) {
    return await this.tryFetchForPost(`${ADDRESS}/api/updatePost/${postID}`);
  }

  async approvePost(postID) {
    return await this.tryFetchForPost(`${ADDRESS}/api/approvePost/${postID}`);
  }

  async reportPost(postID) {
    return await this.tryFetchForPost(`${ADDRESS}/api/reportPost/${postID}`);
  }

  async inviteUserToChallenge(challenge, username) {
    return await fetch(
      `${ADDRESS}/api/inviteToChallenge/${challenge}/${username}`
    ).then(async (res) => {
      if (res.status >= SERVER_ERROR) {
        const status = await res.text();
        console.log("Server error:");
        console.log(status);
        throw new Error(`Server failed to invite user to challenge`);
      } else {
        return true;
      }
    });
  }

  async userCreated(username) {
    return await fetch(`${ADDRESS}/api/userCreated/${username}`).then(
      async (res) => {
        if (res.status >= SERVER_ERROR) {
          const status = await res.text();
          console.log("Server error:");
          console.log(status);
        } else {
          return true;
        }
      }
    );
  }

  async isAdmin(IDToken) {}

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
