FROM node:20.12.2-alpine3.19 AS build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm ci

COPY ./src /app/src
COPY ./index.html /app/index.html
COPY ./tsconfig.json /app/tsconfig.json
COPY ./tsconfig.node.json /app/tsconfig.node.json
COPY ./vite.config.ts /app/vite.config.ts

RUN npm run build

FROM nginx:1.27.0-alpine3.19

COPY --from=build /app/dist /usr/share/nginx/html

COPY ./scripts/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./scripts/setup-env.sh /app/setup-env.sh

RUN chmod +x /app/setup-env.sh

EXPOSE 3001
EXPOSE 3002
CMD /app/setup-env.sh && nginx -g "daemon off;"
