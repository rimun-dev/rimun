import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const mailTransport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  pool: true,
  secure: true,
  maxConnections: 3,
  auth: { user: process.env.MAIL_USERNAME, pass: process.env.MAIL_PASSWORD },
  tls: { rejectUnauthorized: false },
} as SMTPTransport.Options);

export default mailTransport;
