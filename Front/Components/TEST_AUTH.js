import Auth from "./Auth.js";

const a = new Auth();

let ref = a.uploadImages(["./dog1.jpg"]);
console.log(ref);
