import * as ftp from "basic-ftp";
import { randomUUID } from "crypto";
import { mkdir, readFile, rmdir } from "fs/promises";
import { ftpConfig } from "src/storage";
import { authenticatedProcedure, trpc } from "../../trpc";
import { checkPersonPermission, getCurrentSession } from "../utils";
import { generateBadges } from "./pdf";

const ATTENDEES_TSV_HEADER = [
  "Name",
  "Surname",
  "Email",
  "Phone",
  "Birthday",
  "Gender",
  "T-shirt",
  "Group",
  "Role",
  "School",
].join("\t");

const exportsRouter = trpc.router({
  getAttendeesTSV: authenticatedProcedure.query(async ({ ctx }) => {
    await checkPersonPermission(ctx, { userGroupName: "secretariat" });

    const currentSession = await getCurrentSession(ctx);

    const result = await ctx.prisma.personApplication.findMany({
      where: { session_id: currentSession.id, status_application: "ACCEPTED" },
      include: {
        confirmed_role: true,
        confirmed_group: true,
        school: true,
        person: { include: { account: true } },
      },
    });

    let output = ATTENDEES_TSV_HEADER + "\n";
    for (const r of result) {
      output +=
        [
          r.person.name,
          r.person.surname,
          r.person.account?.email,
          r.person.phone_number,
          r.person.birthday?.toDateString(),
          r.person.gender,
          r.person.tshirt_size,
          r.confirmed_group?.name,
          r.confirmed_role?.name,
          r.school?.name,
        ].join("\t") + "\n";
    }

    return output;
  }),

  generateBadge: authenticatedProcedure.query(async ({ ctx }) => {
    const currentSession = await getCurrentSession(ctx);

    const result = await ctx.prisma.personApplication.findMany({
      where: {
        session_id: currentSession.id,
        status_application: "ACCEPTED",
      },
      include: {
        person: { include: { account: true, country: true } },
        school: { include: { country: true } },
        confirmed_group: true,
        confirmed_role: true,
        committee: true,
        delegation: { include: { country: true } },
      },
    });

    // TODO: move into storage
    const ftpClient = new ftp.Client();
    await ftpClient.access(ftpConfig as ftp.AccessOptions);

    const pictures = new Map<string, string>();

    try {
      await mkdir("temp");
    } catch (e) {
      console.error(e);
    }

    for (const attendee of result) {
      const path = attendee.person.picture_path;
      const ext = path.split(".")[1];

      const tempFileName = `temp/${randomUUID()}.${ext}`;
      try {
        await ftpClient.downloadTo(tempFileName, path);
        pictures.set(path, tempFileName);
      } catch {
        continue;
      }
    }

    const badges = await generateBadges(
      result,
      currentSession,
      async (path) => {
        const tempFileName = pictures.get(path);

        if (!tempFileName) {
          return null;
        }

        const data = await readFile(tempFileName);
        return data;
      }
    );

    ftpClient.close();

    try {
      await rmdir("temp");
    } catch (e) {
      console.error(e);
    }

    return badges;
  }),
});

export default exportsRouter;
