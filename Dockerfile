FROM node:14-alpine

WORKDIR /app

COPY . .

CMD npm ci

RUN node index.js