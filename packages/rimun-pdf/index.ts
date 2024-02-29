import * as ftp from "basic-ftp";
import { randomUUID } from "crypto";
import { config as dotenv } from "dotenv";
import workspacesRoot from "find-yarn-workspace-root";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import { exit } from "process";
import { prisma } from "./database";
import { generateBadges } from "./src";

if (process.env.NODE_ENV === "development") {
  const rootDirectory = workspacesRoot();
  dotenv({ path: `${rootDirectory}/.env` });
}

const N_BLANK_BADGES_PER_ROLE = 10;

export const ftpConfig = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  port: Number.parseInt(process.env.FTP_PORT ?? "21"),
} satisfies ftp.AccessOptions;

async function generate() {
  console.log("Generating badges");
  console.log("Fetching session info");

  const session = await prisma.session.findFirst({
    where: { is_active: true },
  });

  if (!session) {
    console.error("No active session in the database.");
    exit(1);
  }

  console.log("Fetching attendee info");
  const result = await prisma.personApplication.findMany({
    where: {
      session: { is_active: true },
      status_application: "ACCEPTED",
    },
    include: {
      person: { include: { account: true, country: true } },
      school: { include: { country: true } },
      delegation: { include: { country: true } },
      committee: true,
      confirmed_role: true,
      confirmed_group: true,
    },
  });

  console.log("Initializing FTP connection");

  const ftpClient = new ftp.Client();
  await ftpClient.access(ftpConfig as ftp.AccessOptions);

  const pictures = new Map<string, string>();

  try {
    await mkdir("temp");
    console.log("Created cache dir 'temp'");
  } catch {
    console.log("Cache dir 'temp' already exists");
  }

  console.log("Downloading profile pictures");

  let downloaded = 0;

  for (const attendee of result) {
    const path = attendee.person.picture_path;
    const ext = path.split(".")[1];

    const tempFileName = `temp/${randomUUID()}.${ext}`;
    try {
      await ftpClient.downloadTo(tempFileName, path);
      pictures.set(path, tempFileName);
    } catch {
      continue;
    } finally {
      process.stdout.write(`Downloaded ${++downloaded}/${result.length}\r`);
    }
  }

  let generated = 0;

  console.log("Generating badges\n");

  const badges = await generateBadges(
    result,
    session,
    async (path) => {
      const tempFileName = pictures.get(path);

      if (!tempFileName) {
        return null;
      }

      const data = await readFile(tempFileName);

      return data;
    },
    () => {
      process.stdout.write(
        `Generated ${++generated}/${result.length + N_BLANK_BADGES_PER_ROLE}\r`
      );
    }
  );

  ftpClient.close();

  try {
    await rm("temp", { recursive: true, force: true });
  } catch (e) {
    console.error(e);
  }

  const outputFileName = `badges_${new Date().getTime()}.pdf`;

  console.log(`Saving badges to file '${outputFileName}'`);

  await writeFile(outputFileName, badges);
}

function main() {
  generate().catch(console.error);
}

main();
