# Builder stage
FROM node:22.14.0-alpine AS builder

ARG SERVICE

WORKDIR /app

COPY ./apps/$SERVICE ./apps/$SERVICE

COPY ./libs ./libs

COPY ./nx.json .

COPY ./package*.json .

COPY ./tsconfig*.json .

COPY ./eslint.config.mjs .

COPY ./jest.config.ts .

COPY ./jest.preset.js .

RUN npm install

ENV NX_DAEMON=false

RUN npx nx sync

RUN npx nx build common

RUN npx nx build $SERVICE

# Runner stage
FROM node:22.14.0-alpine AS runner

ARG SERVICE

ARG HTTP_PORT

WORKDIR /app

COPY --from=builder app/apps/$SERVICE/dist ./dist/apps/$SERVICE

COPY --from=builder app/dist/libs ./dist/libs

COPY --from=builder app/package*.json .

RUN npm install --omit=dev

EXPOSE $HTTP_PORT

WORKDIR /app/dist/apps/$SERVICE

ENTRYPOINT ["node", "main"]