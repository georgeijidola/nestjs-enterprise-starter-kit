FROM node:22-alpine
WORKDIR /code

COPY package.json ./
RUN npm i -g husky
RUN npm i -g @nestjs/cli
RUN npm i -D @types/node

COPY prisma ./prisma
RUN npm run prisma:generate

COPY . .
RUN npm run build

CMD [ "npm", "run", "start:prod" ]
