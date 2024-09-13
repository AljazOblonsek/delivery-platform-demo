FROM node:20.12.2-alpine

WORKDIR /app

RUN apk add bash

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install

COPY ./docker/entrypoint.sh /app/entrypoint.sh
COPY ./tsconfig.json /app/tsconfig.json
COPY ./docker/hardhat-docker.config.ts /app/hardhat.config.ts
COPY ./src /app/src
COPY ./typechain-types /app/typechain-types
COPY ./artifacts /app/artifacts

EXPOSE 8545

ENTRYPOINT ["/app/entrypoint.sh"]
