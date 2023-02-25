import { TRPCError } from "@trpc/server";
import { z } from "zod";
import mailTransport from "../email";
import Storage from "../storage";
import { Context, trpc } from "../trpc";
import {
  accountBaseSchema,
  getThumbnailImageBuffer,
  hashPassword,
  personBaseSchema,
} from "./utils";

async function checkForExistingAccount(ctx: Context, email: string) {
  const existingAccount = await ctx.prisma.account.findUnique({
    where: { email },
  });

  if (existingAccount)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Email already in use",
    });
}

const registrationRouter = trpc.router({
  /** Register a personal account. */
  registerPerson: trpc.procedure
    .input(
      z.object({
        account: accountBaseSchema,
        person: personBaseSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkForExistingAccount(ctx, input.account.email);

      const pictureImage = await getThumbnailImageBuffer(input.person.picture);
      const picture_path = await Storage.upload(
        pictureImage.data,
        pictureImage.type,
        "img/profile"
      );

      const { picture, ...person } = input.person;

      const account = await ctx.prisma.account.create({
        data: {
          ...input.account,
          password: await hashPassword(input.account.password),
          is_school: false,
          is_active: true,
          is_admin: false,
          person: {
            create: {
              ...person,
              full_name: `${input.person.name} ${input.person.surname}`,
              picture_path,
            },
          },
        },
        include: { person: true },
      });

      await mailTransport.sendMail({
        subject: "[RIMUN] Welcome!",
        text: getWelcomeEmailText(account.person!.full_name),
        html: getWelcomeEmailHTML(account.person!.full_name),
        from: process.env.MAIL_USERNAME,
        to: [account.email],
      });
    }),

  /** Register a school account. */
  registerSchool: trpc.procedure
    .input(
      z.object({
        account: accountBaseSchema,
        school: z.object({
          name: z.string(),
          city: z.string(),
          country_id: z.number(),
          address_street: z.string(),
          address_number: z.string(),
          address_postal: z.string(),
          is_network: z.boolean(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkForExistingAccount(ctx, input.account.email);

      const account = await ctx.prisma.account.create({
        data: {
          ...input.account,
          password: await hashPassword(input.account.password),
          is_school: true,
          is_active: true,
          is_admin: false,
          school: { create: input.school },
        },
        include: { school: true },
      });

      await mailTransport.sendMail({
        subject: "[RIMUN] Welcome!",
        text: getWelcomeEmailText(account.school!.name),
        html: getWelcomeEmailHTML(account.school!.name),
        from: process.env.MAIL_USERNAME,
        to: [account.email],
      });
    }),
});

function getWelcomeEmailHTML(name: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>RIMUN Registration Email</title>
</head>
<body>
  <p>Welcome to RIMUN, ${name}!</p>

  <p>
    We are glad you decided to create an account.
  </p>

  <p>
    Once you apply for RIMUN, the Secretariat will keep you updated on any news, 
    including your application status, and you will receive further notifications 
    at this address.
  </p>

  <p>
    Please do not respond to this email since it's generated automatically, for
    any information contact <a href="mailto:info@rimun.com">info@rimun.com</a>.
  </p>

  <p>The RIMUN team</p>
</body>
</html>
`;
}

function getWelcomeEmailText(name: string) {
  return `
Welcome to RIMUN, ${name}!

We are glad you decided to create an account.

Once you apply for RIMUN, the Secretariat will keep you updated on any news, 
including your application status, and you will receive further notifications 
at this address.

Please do not respond to this email since it's generated automatically, for
any information contact info@rimun.com.

The RIMUN team
`;
}

export default registrationRouter;
