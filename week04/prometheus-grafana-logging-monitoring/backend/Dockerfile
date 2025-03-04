FROM node:22-alpine

WORKDIR /app/backend

COPY package*.json .

RUN npm install

COPY . .

CMD ["npx", "nodemon", "--legacy-watch", "server.js"]
