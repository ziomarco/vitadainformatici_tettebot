FROM node:14-alpine

WORKDIR /app

COPY . .

RUN echo $TELEGRAM_BOT_TOKEN >> .env

RUN echo $TELEGRAM_BOT_NAME >> .env

RUN npm ci

CMD node index.js