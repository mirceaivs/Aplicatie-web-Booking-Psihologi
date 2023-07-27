#docker build -t licenta_server -f #pathDockerfile si . deoarece 
#trebuie sa spunem care e build contextul 
#unde rulam comanda 
FROM node:14 as base

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

FROM base as production

ENV NODE_PATH = ./build

RUN npm run build
