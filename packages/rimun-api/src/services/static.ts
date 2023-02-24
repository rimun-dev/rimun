import { z } from "zod";
import FTPStorage from "../storage";
import { trpc } from "../trpc";

const staticRouter = trpc.router({
  get: trpc.procedure.input(z.string()).query(async ({ input }) => {
    return await FTPStorage.download(input);
  }),
});

export default staticRouter;
