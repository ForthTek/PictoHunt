const ORDER_BY_TIME = "timestamp";
const ORDER_BY_SCORE = "score";
const DIRECTION_ASC = "asc";
const DIRECTION_DESC = "desc";

export default class Filter {
  constructor() {
    this.orderBy = ORDER_BY_TIME;
    this.direction = DIRECTION_DESC;
    this.followedUsers = true;
    this.followedChannels = true;
  }

  static get ORDER_BY_TIME() {
    return ORDER_BY_TIME;
  }

  static get ORDER_BY_SCORE() {
    return ORDER_BY_SCORE;
  }

  static get DIRECTION_DESC() {
    return DIRECTION_DESC;
  }

  static get DIRECTION_ASC() {
    return DIRECTION_ASC;
  }
}
