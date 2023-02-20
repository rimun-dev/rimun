import { prisma } from "../database";
import { trpc } from "../trpc";
import { getCurrentSession } from "./utils";

const infoRouter = trpc.router({
  getCountries: trpc.procedure.query(
    async () => await prisma.country.findMany()
  ),

  getSessions: trpc.procedure.query(
    async () => await prisma.session.findMany()
  ),

  getResources: trpc.procedure.query(
    async () => await prisma.resource.findMany()
  ),

  getForums: trpc.procedure.query(async () => {
    const currentSession = await getCurrentSession();

    const forums = await prisma.forum.findMany();
    const committees = await prisma.committee.findMany({
      where: { session_id: currentSession.id },
    });

    const committees_stats: { [cid: number]: number } = {};
    for (let c of committees) {
      committees_stats[c.id] = await prisma.personApplication.count({
        where: { committee_id: c.id, session_id: currentSession.id },
      });
    }

    return { forums, committees, committees_stats };
  }),
});

export default infoRouter;
