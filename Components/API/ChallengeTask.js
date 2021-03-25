export default class ChallengeTask {
  constructor(
    description,
    channel,
    latitude = null,
    longitude = null,
    radius = 25
  ) {
    this.description = description;
    this.channel = channel;
    this.latitude = latitude;
    this.longitude = longitude;
    this.radius = radius;
  }
}
