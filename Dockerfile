FROM node:22-alpine

WORKDIR /app

# package.json 복사 (둘 다 동작하도록)
# docker build 환경과 docker-compose 환경 둘다 동작하기 위해서
COPY package*.json ./
COPY ./package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN mkdir -p uploads/members uploads/articles

CMD ["npm", "run", "start:prod"]

