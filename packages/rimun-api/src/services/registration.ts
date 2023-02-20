import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../database";
import mailTransport from "../email";
import Storage from "../storage";
import { trpc } from "../trpc";
import {
  accountBaseSchema,
  getThumbnailImageBuffer,
  hashPassword,
  personBaseSchema,
} from "./utils";

async function checkForExistingAccount(email: string) {
  const existingAccount = await prisma.account.findUnique({
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
    .input(accountBaseSchema.and(personBaseSchema))
    .mutation(async ({ input }) => {
      await checkForExistingAccount(input.email);

      const account = await prisma.account.create({
        data: {
          ...input,
          password: await hashPassword(input.password),
          is_school: false,
          is_active: true,
          is_admin: false,
        },
      });

      const picture = await getThumbnailImageBuffer(input.picture);
      const picture_path = await Storage.upload(
        picture.data,
        picture.type,
        "img/profile"
      );

      const person = await prisma.person.create({
        data: {
          ...input,
          fullName: `${input.name} ${input.surname}`,
          picture_path,
          account_id: account.id,
        },
      });

      await mailTransport.sendMail({
        subject: "[RIMUN] Welcome!",
        text: getWelcomeEmailText(person.fullName),
        html: getWelcomeEmailHTML(person.fullName),
        from: process.env.MAIL_USERNAME,
        to: [account.email],
      });
    }),

  /** Register a school account. */
  registerSchool: trpc.procedure
    .input(
      z
        .object({
          name: z.string(),
          city: z.string(),
          country_id: z.number(),
          address_street: z.string(),
          address_number: z.string(),
          address_postal: z.string(),
          is_network: z.boolean(),
        })
        .and(accountBaseSchema)
    )
    .mutation(async ({ input }) => {
      await checkForExistingAccount(input.email);

      const account = await prisma.account.create({
        data: {
          ...input,
          password: await hashPassword(input.password),
          is_school: true,
          is_active: true,
          is_admin: false,
        },
      });

      const school = await prisma.school.create({
        data: { ...input, account_id: account.id },
      });

      await mailTransport.sendMail({
        subject: "[RIMUN] Welcome!",
        text: getWelcomeEmailText(school.name),
        html: getWelcomeEmailHTML(school.name),
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
