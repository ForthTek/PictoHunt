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

      this.#database = firebase.firestore().ref();
      this.#storage = firebase.storage().ref();

      console.log("created")
    }
  }

  uploadImages(photoPaths) {
    /** Reference to the new post */
    const newReference = this.#database.collection("Posts").doc();

    for (let i = 0; i < photoPaths.length; i++) {
      this.#uploadImage(newReference.id, i, photoPaths[i]);
    }

    // Return the reference so we can create a post there
    return newReference;
  }

  #uploadImage(newPostName, positionInPost, localPath) {
    const ref = this.#storage.child(`/Posts/${newPostName}/${positionInPost}}`);

    // Don't use this for now
    const metadata = {
      contentType: "image/jpeg",
    };

    // Upload the file
    var uploadTask = ref.put(localPath);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
    );
  }
}
