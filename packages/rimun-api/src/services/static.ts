import { z } from "zod";
import FTPStorage from "../storage";
import { trpc } from "../trpc";

const staticRouter = trpc.router({
  get: trpc.procedure.input(z.string()).query(async ({ input }) => {
    const buff = await FTPStorage.download(input);
    return buff.toString("base64");
  }),
});

export default staticRouter;
