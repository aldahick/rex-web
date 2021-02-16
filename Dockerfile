FROM node:12.18-alpine

EXPOSE 5000

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

COPY tsconfig.json craco.config.js ./
COPY src ./src
COPY public ./public
RUN yarn build

COPY scripts ./scripts

CMD yarn start:prod
