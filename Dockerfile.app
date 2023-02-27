FROM node:16.18.0 as build-container

WORKDIR /tmp/build

COPY --chown=node:node yarn.lock .
COPY --chown=node:node package.json .
COPY --chown=node:node tsconfig.base.json .

COPY --chown=node:node packages/rimun-app/package.json ./packages/rimun-app/
COPY --chown=node:node packages/rimun-app/tsconfig.json ./packages/rimun-app/
COPY --chown=node:node packages/rimun-app/tailwind.config.js ./packages/rimun-app/
COPY --chown=node:node packages/rimun-app/src ./packages/rimun-app/src
COPY --chown=node:node packages/rimun-app/public ./packages/rimun-app/public

COPY --chown=node:node packages/rimun-api/package.json ./packages/rimun-api/
COPY --chown=node:node packages/rimun-api/tsconfig.json ./packages/rimun-api/
COPY --chown=node:node packages/rimun-api/src ./packages/rimun-api/src

RUN chown -R node:node /tmp/build

USER node

ENV PUBLIC_URL /dashboard

RUN yarn --non-interactive
RUN yarn workspace @rimun/api run build
RUN yarn workspace @rimun/app run build

###

FROM nginx:alpine as runtime-container

COPY packages/rimun-app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-container /tmp/build/packages/rimun-app/build /usr/share/nginx/html/admin

ENV PORT 8080
ENV HOST 0.0.0.0

EXPOSE 8080