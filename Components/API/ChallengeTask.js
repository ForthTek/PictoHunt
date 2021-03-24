export default class ChallengeTask {
  constructor(channel, latitude = null, longitude = null, radius = 25) {
    this.channel = channel;
    this.latitude = latitude;
    this.longitude = longitude;
    this.radius = radius;
  }
}
