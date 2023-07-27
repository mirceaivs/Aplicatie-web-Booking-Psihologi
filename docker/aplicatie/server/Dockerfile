FROM node:14 as base

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

FROM base as production

ENV NODE_PATH = ./build

RUN npm run build