import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { logger } from "@sentry/utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { appRouter } from "./services";
import { createContext } from "./trpc";

function applyMiddleware(app: express.Express) {
  app.use(cors({ credentials: true, origin: true }));
  app.use(express.json({ limit: "250MB" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    rateLimit({
      max: 1000, // limit each IP to 1000 requests per windowMs
      windowMs: 60 * 1000, // 1 minute
    })
  );

  if (process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
      ],
      tracesSampleRate: 1.0,
    });

    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
    app.use(Sentry.Handlers.errorHandler());
  }
}

export default function createApp() {
  const app = express();

  applyMiddleware(app);

  app.use(
    ["/api/v[0-9]+/trpc", "/api/trpc", "/trpc"],
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
      onError: ({ error }) => {
        logger.error(error.message);
        if (error.code === "INTERNAL_SERVER_ERROR")
          Sentry.captureException(error.cause);
        if (process.env.NODE_ENV === "development") console.debug(error.cause);
      },
    })
  );

  return app;
}
