FROM node:alpine as deps-container

WORKDIR /tmp/deps

COPY --chown=node:node package.json .
COPY --chown=node:node package-lock.json .
COPY --chown=node:node packages/rimun-api/package.json ./packages/rimun-api/
COPY --chown=node:node packages/rimun-pdf/package.json ./packages/rimun-pdf/
COPY --chown=node:node packages/rimun-app/package.json ./packages/rimun-app/

RUN npm ci --include=dev

COPY --chown=node:node prisma ./

RUN npm run db:generate

###

FROM node:alpine as build-container

WORKDIR /tmp/build

# copy packages
COPY --chown=node:node package.json .
COPY --chown=node:node packages/rimun-api/package.json ./packages/rimun-api/
COPY --chown=node:node packages/rimun-api/package.json ./packages/rimun-api/
COPY --chown=node:node packages/rimun-pdf/package.json ./packages/rimun-pdf/
COPY --chown=node:node packages/rimun-app/package.json ./packages/rimun-app/

# copy tsconfigs
COPY --chown=node:node tsconfig.base.json .
COPY --chown=node:node packages/rimun-api/tsconfig.json ./packages/rimun-api/
COPY --chown=node:node packages/rimun-app/tsconfig.json ./packages/rimun-app/
COPY --chown=node:node packages/rimun-app/tsconfig.node.json ./packages/rimun-app/
COPY --chown=node:node packages/rimun-pdf/tsconfig.json ./packages/rimun-pdf/

# copy source code
COPY --chown=node:node packages/rimun-app/index.html ./packages/rimun-app/
COPY --chown=node:node packages/rimun-app/tailwind.config.js ./packages/rimun-app/
COPY --chown=node:node packages/rimun-app/postcss.config.cjs ./packages/rimun-app/
COPY --chown=node:node packages/rimun-app/vite.config.ts ./packages/rimun-app/
COPY --chown=node:node packages/rimun-app/src ./packages/rimun-app/src
COPY --chown=node:node packages/rimun-app/public ./packages/rimun-app/public

COPY --chown=node:node packages/rimun-api/src ./packages/rimun-api/src

COPY --chown=node:node packages/rimun-pdf/src ./packages/rimun-pdf/src

# copy deps
COPY --chown=node:node --from=deps-container /tmp/deps/node_modules ./node_modules

RUN chown -R node:node /tmp/build

USER node

RUN npm -w @rimun/pdf run build
RUN npm -w @rimun/api run build
RUN npm -w @rimun/app run build

###

FROM nginx:alpine as runtime-container

COPY packages/rimun-app/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-container /tmp/build/packages/rimun-app/dist /usr/share/nginx/html

ENV PORT 8080
ENV HOST 0.0.0.0

EXPOSE 8080