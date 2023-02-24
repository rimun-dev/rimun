import { trpc } from "../trpc";
import applicationsRouter from "./applications";
import authRouter from "./auth";
import committeesRouter from "./committees";
import delegationsRouter from "./delegations";
import directorsRouter from "./directors";
import housingRouter from "./housing";
import infoRouter from "./info";
import newsRouter from "./news";
import profilesRouter from "./profiles";
import registrationRouter from "./registration";
import resourcesRouter from "./resources";
import searchRouter from "./search";
import staticRouter from "./static";
import teamRouter from "./team";

export const appRouter = trpc.router({
  applications: applicationsRouter,
  auth: authRouter,
  committees: committeesRouter,
  delegations: delegationsRouter,
  directors: directorsRouter,
  housing: housingRouter,
  info: infoRouter,
  news: newsRouter,
  profiles: profilesRouter,
  registration: registrationRouter,
  resources: resourcesRouter,
  search: searchRouter,
  static: staticRouter,
  team: teamRouter,
});
