

/**
 * Function to generate a random string of length (for creating a users salt)
 * 
 * @param {number} length 
 * @returns {string}
 */
function randomStr(length) {
  var out = "";
  var chars = "1234567890AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
  for (var i = 0; i < length; i++) {
    // Add random character from chars to output
    out += chars[Math.round(Math.random() * chars.length)];
  }
  return out;
}

/**
 * Function to hash using a salt
 * 
 * @param {string} str 
 * @param {string} salt 
 * @returns {string}
 */
function hashStr(str, salt) {
  var crypto = require('crypto');
  var hash = crypto.createHash('md5').update(str + salt).digest('hex');
  return hash;
}


module.exports = {
  randomStr, hashStr,
}