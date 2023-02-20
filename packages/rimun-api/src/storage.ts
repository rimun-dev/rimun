import * as uuid from "uuid";
import logger from "./logging";

import * as firebase from "firebase-admin";
import * as firebaseStorage from "firebase-admin/storage";

firebase.initializeApp({
  credential: firebase.credential.applicationDefault(),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = firebaseStorage
  .getStorage()
  .bucket(process.env.FIREBASE_STORAGE_BUCKET);

function makeBucketDirName(): string {
  const date = new Date(Date.now());
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}/${m}/${d}`;
}

namespace Storage {
  export async function upload(
    data: Buffer,
    contentType: string,
    rootFolder: string = ""
  ) {
    const ext = contentType.split("/")[1];
    const path = `${rootFolder}/${makeBucketDirName()}/${uuid.v4()}.${ext}`;
    const file = bucket.file(path);
    await file.save(data, { metadata: { contentType } });
    return path;
  }

  export async function remove(path: string) {
    try {
      await bucket.file(path).delete();
    } catch (e) {
      logger.warn(e.message);
    }
  }

  export async function retrieve(path: string) {
    try {
      const file = bucket.file(path);
      const data = await file.download();
      const meta = await file.getMetadata();
      return { meta, data };
    } catch (e) {
      logger.warn(e.message);
      return null;
    }
  }
}

export default Storage;
