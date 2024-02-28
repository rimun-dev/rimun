import { authenticatedProcedure, trpc } from "../trpc";
import { checkPersonPermission, getCurrentSession } from "./utils";

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
    for (let r of result) {
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
});

export default exportsRouter;
