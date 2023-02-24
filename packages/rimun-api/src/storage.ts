import fs from "fs";
import FTPClient from "ftp";
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

const ftpConfig = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  port: Number.parseInt(process.env.FTP_PORT ?? "21"),
} as FTPClient.Options;

namespace FTPStorage {
  export async function upload(
    data: Buffer,
    type: string,
    rootFolder: string = ""
  ) {
    return await new Promise<string>((resolve, reject) => {
      const ext = type.split("/")[1];
      const path = `${rootFolder}/${uuid.v4()}.${ext}`;
      const ftpClient = new FTPClient();

      ftpClient.on("ready", () => {
        ftpClient.put(data, path, () => {
          ftpClient.end();
          resolve(path);
        });
      });

      ftpClient.on("error", reject);
      ftpClient.connect(ftpConfig);
    });
  }

  export async function remove(path: string) {
    await new Promise<void>((resolve, reject) => {
      const ftpClient = new FTPClient();

      ftpClient.on("ready", () => {
        ftpClient.delete(path, reject);
        resolve();
      });

      ftpClient.on("error", reject);
      ftpClient.connect(ftpConfig);
    });
  }

  export async function download(path: string) {
    return await new Promise<Buffer>((resolve, reject) => {
      const ftpClient = new FTPClient();

      ftpClient.on("ready", () => {
        ftpClient.get(path, (err, stream) => {
          if (err) reject(err);
          stream.once("close", ftpClient.end);
          stream.pipe(fs.createWriteStream(path));
          resolve(fs.readFileSync(path));
        });
      });

      ftpClient.on("error", reject);
      ftpClient.connect(ftpConfig);
    });
  }
}

export default FTPStorage;
