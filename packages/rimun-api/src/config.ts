import { z } from "zod";

const envSchema = z.object({
  HOST: z.string().optional(),
  PORT: z.coerce.number().int().optional(),
  SENTRY_DSN: z.string().url(),
  FTP_HOST: z.string(),
  FTP_USER: z.string(),
  FTP_PASSWORD: z.string(),
  FTP_PORT: z.coerce.number().int().optional(),
  DATABASE_URL: z.string().url(),
  MAIL_PASSWORD: z.string(),
  MAIL_PORT: z.coerce.number().int(),
  MAIL_HOST: z.string(),
  MAIL_USERNAME: z.string().email(),
  MAIL_CONTACT_RECIPIENT: z.string().email(),
  JWT_SECRET: z.string(),
  PASSWORD_RECOVERY_URL: z.string().url(),
});

const config = envSchema.parse(process.env);

export default config;
