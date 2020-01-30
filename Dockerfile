FROM node:12.13.1-alpine

EXPOSE 5000

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
# build here for CI verification
RUN npm run compile

# and remove build output
RUN npm run clean

COPY public /app/public

# building here so that appropriate env variables can be inserted outside of CI
CMD npm run serve
