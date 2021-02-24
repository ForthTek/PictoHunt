import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyCvQv_waR8vtFZIrmHlgVexp0VrrGNwGBE",
    authDomain: "picto-hunt.firebaseapp.com",
    projectId: "picto-hunt",
    storageBucket: "picto-hunt.appspot.com",
    messagingSenderId: "762056308518",
    appId: "1:762056308518:web:ec820ae748f1191699b3e7",
    measurementId: "G-HDTRBXWKV1",
};

export default class Auth {
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
            // this.auth = firebase.auth();
            // this.firestore = firebase.firestore();
            // this.storage = firebase.storage();
            // this.functions = firebase.functions();
        }

        //auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
    }
}
