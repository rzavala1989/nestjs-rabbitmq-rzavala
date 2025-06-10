FROM node:22-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./


FROM base AS development
ENV NODE_ENV development
RUN npm install
COPY . .


FROM development AS builder
ENV NODE_ENV production
RUN npm run build


FROM base AS production
ENV NODE_ENV production
RUN npm ci --only=production
COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
