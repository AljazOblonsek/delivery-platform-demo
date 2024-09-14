FROM node:20.12.2-alpine3.19 AS build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm ci

COPY ./app /app/app
COPY ./lib /app/lib
COPY ./public /app/public
COPY ./next.config.mjs /app/next.config.mjs
COPY ./tsconfig.json /app/tsconfig.json

RUN npm run build

FROM node:20.12.2-alpine3.19 AS runtime

WORKDIR /app

COPY --from=build /app/public /app/public 
COPY --from=build /app/.next/standalone /app
COPY --from=build /app/.next/static /app/.next/static

EXPOSE 3000

ENTRYPOINT ["node", "/app/server.js"]