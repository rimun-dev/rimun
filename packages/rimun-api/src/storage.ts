// import FTPClient from "ftp";
import * as ftp from "basic-ftp";
import { readFileSync, rmSync } from "fs";
import { Readable } from "stream";
import * as uuid from "uuid";

/*
  The following is a simple implementation for Supabase bucket storage.
  However, due to budget reasons we are still relying on the old FTP server
  for static file storage.
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const bucket = supabase.storage.from(process.env.SUPABASE_BUCKET!);

namespace SupabaseStorage {
  export async function upload(
    data: Buffer,
    type: string,
    rootFolder: string = ""
  ) {
    const ext = type.split("/")[1];
    const path = `${rootFolder}/${uuid.v4()}.${ext}`;
    await bucket.upload(path, data);
    return path;
  }

  export async function remove(path: string) {
    await bucket.remove([path]);
  }
}
*/

// const STATIC_FOLDER = process.env.STATIC_FOLDER ?? "static";

export function makeBucketDirName(): string {
  const date = new Date(Date.now());
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}/${m}/${d}`;
}

const ftpConfig = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  port: Number.parseInt(process.env.FTP_PORT ?? "21"),
} as ftp.AccessOptions;

namespace FTPStorage {
  export async function upload(
    data: Buffer,
    type: string,
    rootFolder: string = ""
  ) {
    const ext = type.split("/")[1];
    const dir = `${rootFolder}/${makeBucketDirName()}`;
    const path = `${uuid.v4()}.${ext}`;
    const dirPath = `${dir}/${path}`;

    const ftpClient = new ftp.Client();
    await ftpClient.access(ftpConfig);
    await ftpClient.ensureDir(dir);
    await ftpClient.uploadFrom(Readable.from(data), path);
    ftpClient.close();

    return dirPath;
  }

  export async function remove(path: string) {
    const ftpClient = new ftp.Client();
    await ftpClient.access(ftpConfig);
    try {
      await ftpClient.remove(path);
    } catch (e) {
      console.debug(e);
    }
    ftpClient.close();
  }

  export async function download(path: string) {
    const ftpClient = new ftp.Client();
    await ftpClient.access(ftpConfig);
    const ext = path.split(".")[1];
    const tempFileName = `${uuid.v4()}.${ext}`;
    await ftpClient.downloadTo(tempFileName, path);
    const buff = readFileSync(tempFileName);
    rmSync(tempFileName);
    ftpClient.close();
    return buff;
  }
}

export default FTPStorage;
