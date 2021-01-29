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

/**
 * 
 * @param {string} email 
 * @returns {boolean}
 */
function isEmailValidFormat(email) {
  // Expression taken from
  // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  // i modifier is used for case insensitive search
  let regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  regex.test(String(email).toLowerCase());
}

/**
 * Function that checks that a password conforms to PictoHunt's password policy. A password 
 * must contain: both lowercase and uppercase letters, at least one digit or special character 
 * #?!@$%^&*- and must be between 8 (inclusive) and 64 (exclusive) characters in length.
 * 
 * @param {string} password 
 * @returns {boolean} Password is valid format
 */
function isPasswordValidFormat(password) {
  // PictoHunt password policy (NF-2-1):
  // •	Both uppercase and lowercase letters
  // •	Inclusion of at least one number or special character
  // The maximum length must be 64 characters and the minimum length must be 8 characters

  // Inspired by this post:
  // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a

  let regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[\d#?!@$%^&*-])[a-zA-Z\d#?!@$%^&*-]{8,64}/;

  regex.test(password);
}



module.exports = {
  randomStr, hashStr,
  isEmailValidFormat, isPasswordValidFormat,
}