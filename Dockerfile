FROM node:12.16-alpine

EXPOSE 5000

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
COPY public ./public
# build here for CI verification
RUN npm run build

# and remove build output
RUN npm run clean

# building here so that appropriate env variables can be inserted outside of CI
CMD npm run serve
