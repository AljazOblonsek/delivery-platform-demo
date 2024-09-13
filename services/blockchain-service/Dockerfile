FROM oven/bun:1.1.18-alpine

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./bun.lockb /app/bun.lockb

RUN bun install --frozen-lockfile --production

COPY ./assets /app/assets
COPY ./migrations /app/migrations
COPY ./src /app/src

CMD bun run migration:run && bun run sync:local-ethereum-node && bun run start
