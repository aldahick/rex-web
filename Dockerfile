FROM node:12.18-alpine

EXPOSE 5000

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src
COPY public ./public
# build here for CI verification
RUN yarn build

# and remove build output
RUN yarn clean

COPY craco.config.js ./
COPY scripts ./scripts
# building here so that appropriate env variables can be inserted outside of CI
CMD yarn start:prod
