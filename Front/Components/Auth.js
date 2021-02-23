const config = {
  apiKey: "AIzaSyCvQv_waR8vtFZIrmHlgVexp0VrrGNwGBE",
  authDomain: "picto-hunt.firebaseapp.com",
  projectId: "picto-hunt",
  storageBucket: "picto-hunt.appspot.com",
  messagingSenderId: "762056308518",
  appId: "1:762056308518:web:ec820ae748f1191699b3e7",
  measurementId: "G-HDTRBXWKV1",
};

import * as firebase from "firebase";

export default class Auth {
  constructor() {
    firebase.initializeApp(config);

    window.firebase = firebase;

    this.auth = firebase.auth();
    auth.setPersistence(firebase.auth.Auth.Persistence.NONE);

    // Listen for authentication state to change.
    auth.onAuthStateChanged((user) => {
      if (user != null) {
        console.log("We are authenticated now!");
      }

      // Do other things
    });
  }
}
