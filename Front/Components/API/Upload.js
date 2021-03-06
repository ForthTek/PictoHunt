import "firebase/storage";

export default class Upload {
    #storage;

    constructor(firebase) {
        this.#storage = firebase.storage().ref();
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

        // Don't use this for now
        const metadata = {
            contentType: "image/jpeg",
        };

        // Upload the file
        let URL = await ref.put(image).then((snapshot) => {
            return snapshot.ref.getDownloadURL();
        });

        console.log(`Uploaded image with path ${ref.path} and DLL ${URL}`);

        return URL;
    }
}
