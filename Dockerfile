FROM node:23.5-alpine3.20 AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm ci --ignore-scripts && \
    npx prisma generate && \
    npm run build && \
    npm prune --production

FROM node:23.5-alpine3.20
WORKDIR /app

RUN apk upgrade --no-cache && \
    apk add --no-cache dumb-init && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --chown=nestjs:nodejs package.json ./

USER nestjs
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]
