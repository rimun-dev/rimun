import { TRPCError } from "@trpc/server";
import { z } from "zod";
import mailTransport from "../email";
import { trpc } from "../trpc";

const contactRouter = trpc.router({
  sendContactEmail: trpc.procedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        body: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      if (!process.env.MAIL_CONTACT_RECIPIENT)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "MAIL_CONTACT_RECIPIENT env variable not set",
        });
      await mailTransport.sendMail({
        subject: `[Contact Form] Message from ${input.name}`,
        text: input.body,
        from: process.env.MAIL_USERNAME,
        to: [process.env.MAIL_CONTACT_RECIPIENT],
      });
    }),
});

export default contactRouter;
