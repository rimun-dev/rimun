// import FTPClient from "ftp";
import * as ftp from "basic-ftp";
import { FTPError } from "basic-ftp";
import { readFileSync, rmSync } from "fs";
import { Readable } from "stream";
import * as uuid from "uuid";
import config from "./config";

/*
  The following is a simple implementation for Supabase bucket storage.
  However, due to budget reasons we are still relying on the old FTP server
  for static file storage.
export const supabase = createClient(
  config.SUPABASE_URL!,
  config.SUPABASE_KEY!
);

const bucket = supabase.storage.from(config.SUPABASE_BUCKET!);

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

// const STATIC_FOLDER = config.STATIC_FOLDER ?? "static";

export function makeBucketDirName(): string {
  const date = new Date(Date.now());
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}/${m}/${d}`;
}

export const ftpConfig = {
  host: config.FTP_HOST,
  user: config.FTP_USER,
  password: config.FTP_PASSWORD,
  port: config.FTP_PORT ?? 21,
} as ftp.AccessOptions;

// FIXME: workaround for connection limit enforced by FTP server
function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const SLEEP_TIME = 2500;

namespace FTPStorage {
  export async function upload(
    data: Buffer,
    type: string,
    rootFolder: string = ""
  ) {
    const ftpClient = new ftp.Client();

    while (true) {
      try {
        const ext = type.split("/")[1];
        const dir = `${rootFolder}/${makeBucketDirName()}`;
        const path = `${uuid.v4()}.${ext}`;
        const dirPath = `${dir}/${path}`;

        await ftpClient.access(ftpConfig);
        await ftpClient.ensureDir(dir);
        await ftpClient.uploadFrom(Readable.from(data), path);
        ftpClient.close();

        return dirPath;
      } catch (e) {
        if (
          !(e instanceof FTPError) &&
          !(e instanceof Error && e.name.includes("Timeout"))
        ) {
          console.debug(e);
          throw e;
        }
        await sleep(SLEEP_TIME);
        continue;
      } finally {
        ftpClient.close();
      }
    }
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
    let retryCnt = 5;
    while (retryCnt-- > 0) {
      try {
        const ftpClient = new ftp.Client();
        await ftpClient.access(ftpConfig);
        const ext = path.split(".")[1];
        const tempFileName = `${uuid.v4()}.${ext}`;
        await ftpClient.downloadTo(tempFileName, path);
        const buff = readFileSync(tempFileName);
        rmSync(tempFileName);
        ftpClient.close();
        return buff;
      } catch (e) {
        if (!(e instanceof FTPError)) throw e;
        console.log(e);
        await sleep(SLEEP_TIME);
        continue;
      }
    }

    throw new Error();
  }
}

export default FTPStorage;
