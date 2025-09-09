import { z } from "zod";
import config from "../config";
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
      await mailTransport.sendMail({
          subject: `[Contact Form] Message from ${input.name} (${input.email})`,
          text: `From: ${input.email}\nName: ${input.name}\n\n${input.body}`,
          from: config.MAIL_USERNAME,
          to: [config.MAIL_CONTACT_RECIPIENT],
        });
    }),
});

export default contactRouter;
