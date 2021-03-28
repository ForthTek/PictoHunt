import "firebase/storage";

export default class Upload {
  #storage;
  #auth;

  constructor(firebase) {
    this.#storage = firebase.storage().ref();
    this.#auth = firebase.auth();
  }

  async uploadImagesForPost(postID, photos) {
    let URLs = [];
    for (let i = 0; i < photos.length; i++) {
      URLs.push(await this.uploadImageForPost(postID, i, photos[i]));
    }

    return URLs;
  }

  async uploadImageForPost(postID, positionInPost, image) {
    // We should store images in the format
    // Posts/<postID>/<positionInPost>
    // This will avoid all conflicts for filenames
    const ref = this.#storage.child(`/Posts/${postID}/${positionInPost}`);
    const uid = this.#auth.currentUser.uid;

    // Don't use this for now
    const metadata = {
      customMetadata: {
        UID: uid,
      },
    };

    // Upload the file
    let URL = await ref.put(image, metadata).then((snapshot) => {
      return snapshot.ref.getDownloadURL();
    });

    return URL;
  }

  async deleteImagesForPost(postID, number) {
    // Delete all the photos in the post
    for (let i = 0; i < number; i++) {
      const ref = this.#storage.child(`/Posts/${postID}/${i}`);
      await ref.delete();
    }

    return true;
  }
}
