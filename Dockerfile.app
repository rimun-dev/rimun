FROM node:16.18.0 as build-container

WORKDIR /tmp/build

COPY --chown=node:node yarn.lock .
COPY --chown=node:node package.json .
COPY --chown=node:node tsconfig.base.json .

COPY --chown=node:node packages/app/package.json ./packages/app/
COPY --chown=node:node packages/app/tsconfig.json ./packages/app/
COPY --chown=node:node packages/app/tailwind.config.js ./packages/app/
COPY --chown=node:node packages/app/src ./packages/app/src
COPY --chown=node:node packages/app/public ./packages/app/public

COPY --chown=node:node packages/api/package.json ./packages/api/
COPY --chown=node:node packages/api/tsconfig.json ./packages/api/
COPY --chown=node:node packages/api/tsconfig.prod.json ./packages/api/
COPY --chown=node:node packages/api/src ./packages/api/src

RUN chown -R node:node /tmp/build

USER node

ENV PUBLIC_URL /dashboard

RUN yarn --non-interactive
RUN yarn workspace @rimun/api run build
RUN yarn workspace @rimun/app run build

###

FROM nginx:alpine as runtime-container

COPY packages/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-container /tmp/build/packages/app/build /usr/share/nginx/html/admin

ENV PORT 8080
ENV HOST 0.0.0.0

EXPOSE 8080