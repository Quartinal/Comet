FROM node:bookworm

WORKDIR /app

COPY ["package.json", "./"]

RUN npm i -g pnpm && pnpm i

WORKDIR /app/node_modules/rammerhead

# to satisfy rammerhead
RUN mkdir public && npm i --save-dev dotenv-flow && npm run build

WORKDIR /app

COPY . .

CMD chmod +x index.ts && ./index.ts

EXPOSE 5000