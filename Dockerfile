FROM node:24-alpine AS dev

ENV TZ=Europe/Rome
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app

COPY package.json nest-cli.json tsconfig.json tsconfig.build.json ./
RUN npm install

COPY . .


FROM dev AS prod

WORKDIR /usr/src/app

RUN npm run build

RUN chmod +x ./start.sh
