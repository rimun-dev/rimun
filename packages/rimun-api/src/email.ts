import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import config from "./config";

const mailTransport = nodemailer.createTransport({
  host: config.MAIL_HOST,
  port: config.MAIL_PORT,
  pool: true,
  secure: true,
  maxConnections: 3,
  auth: { user: config.MAIL_USERNAME, pass: config.MAIL_PASSWORD },
  tls: { rejectUnauthorized: false },
} as SMTPTransport.Options);

export default mailTransport;
