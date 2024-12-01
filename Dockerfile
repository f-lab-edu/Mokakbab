FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN mkdir -p uploads/members uploads/articles

CMD ["npm", "run", "start:prod"]