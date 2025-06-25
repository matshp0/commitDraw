FROM node:22-alpine AS frontend-builder
WORKDIR /app

COPY package.json package-lock.json* ./

COPY apps/frontend ./apps/frontend

RUN cd apps/frontend && npm ci

RUN cd apps/frontend && npm run build


FROM node:22-alpine AS server-builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY apps/server .

RUN npm run build:server

FROM node:22-alpine

WORKDIR /app

COPY --from=frontend-builder /app/apps/frontend/dist ./apps/frontend/dist
COPY --from=server-builder /app/dist ./dist
COPY --from=server-builder /app/node_modules ./node_modules
COPY --from=server-builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
