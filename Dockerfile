FROM node:12-alpine AS builder

EXPOSE 3000

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

COPY tsconfig.json craco.config.js ./
COPY src ./src
COPY public ./public
RUN yarn build

FROM node:18-alpine AS server

RUN npm i -g serve

COPY --from=builder build build
COPY scripts scripts
CMD sh scripts/serve.sh build
