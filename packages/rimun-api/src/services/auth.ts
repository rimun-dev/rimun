import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createToken, extractUserIdentity } from "../authn";
import { prisma } from "../database";
import mailTransport from "../email";
import { trpc } from "../trpc";
import { hashPassword } from "./utils";

const authRouter = trpc.router({
  login: trpc.procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const account = await prisma.account.findUnique({
        where: { email: input.email.trim() },
        include: { person: { include: { applications: true } } },
      });

      if ((await hashPassword(input.password)) !== account?.password)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Wrong email or password",
        });

      return account;
    }),

  resetPassword: trpc.procedure
    .input(
      z.object({
        token: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const payload = await extractUserIdentity(input.token);

      if (!payload?.sub)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "The token you provided is invalid or expired.",
        });

      return await prisma.account.update({
        where: { id: Number.parseInt(payload.sub) },
        data: {
          password: await hashPassword(input.password),
        },
      });
    }),

  sendResetEmail: trpc.procedure
    .input(z.string().email())
    .mutation(async ({ input }) => {
      const account = await prisma.account.findUnique({
        where: { email: input.trim() },
      });

      if (!account)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "There is no user associated with this email.",
        });

      const token = await createToken(account.id.toString());

      await mailTransport.sendMail({
        subject: "[RIMUN] Recover Password",
        text: getRecoverEmailText(token),
        html: getRecoverEmailHTML(token),
        from: process.env.MAIL_USERNAME,
        to: [account.email],
      });
    }),
});

function getRecoverEmailHTML(token: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>RIMUN Reset Password Email</title>
    </head>
    <body>
    <p>We received a request to reset your RIMUN password.</p>

    <p>To reset your password follow this link:</p>

    <p>
    <a href="https://$host/password-recovery/${token}">Reset password page</a>
    </p>

    <p>If you have not sent any request just ignore this email.</p>

    <p>
    Remember that this link will only be valid for 24 hours, 
    if it expires you will just have to go through the reset procedure again.
    </p>

    <p>
    Please do not reply to this message since it's generated automatically,
    instead contact <a href="mailto:info@rimun.com">info@rimun.com</a> for assistance.
    </p>

    <p>The RIMUN team</p> 
    </body>
`;
}

function getRecoverEmailText(token: string) {
  return `
  We received a request to reset your RIMUN password.

  To reset your password follow this link:
  
  https://$host/password-recovery/${token}
  
  If you have not sent any request just ignore this email.
  
  Remember that this link will only be valid for 24 hours, 
  if it expires you will just have to go through the reset procedure again.
  
  Please do not reply to this message since it's generated automatically,
  instead contact info@rimun.com for assistance.
  
  The RIMUN team 
  `;
}

export default authRouter;
