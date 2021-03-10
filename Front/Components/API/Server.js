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
}
