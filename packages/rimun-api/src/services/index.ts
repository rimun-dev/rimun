import { trpc } from "../trpc";
import applicationsRouter from "./applications";
import authRouter from "./auth";
import committeesRouter from "./committees";
import contactRouter from "./contact";
import delegationsRouter from "./delegations";
import directorsRouter from "./directors";
import exportsRouter from "./exports";
import housingRouter from "./housing";
import infoRouter from "./info";
import newsRouter from "./news";
import profilesRouter from "./profiles";
import registrationRouter from "./registration";
import resourcesRouter from "./resources";
import searchRouter from "./search";
import sessionsRouter from "./sessions";
import teamRouter from "./team";
import timelineRouter from "./timeline";

export const appRouter = trpc.router({
  applications: applicationsRouter,
  auth: authRouter,
  committees: committeesRouter,
  contact: contactRouter,
  delegations: delegationsRouter,
  directors: directorsRouter,
  exports: exportsRouter,
  housing: housingRouter,
  info: infoRouter,
  news: newsRouter,
  profiles: profilesRouter,
  registration: registrationRouter,
  resources: resourcesRouter,
  search: searchRouter,
  sessions: sessionsRouter,
  team: teamRouter,
  timeline: timelineRouter,
});
