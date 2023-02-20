import winston from "winston";

const format = winston.format.printf(({ level, message, timestamp }) => {
  return `${new Date(timestamp).toISOString()} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: "http",
  format,
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "combined.log",
    }),
  ],
});

logger.add(
  process.env.NODE_ENV === "production"
    ? new winston.transports.Stream({ format, stream: process.stdout })
    : new winston.transports.Console({ format })
);

export default logger;
