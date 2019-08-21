FROM node:alpine

RUN mkdir -p /usr/app/typeorm
WORKDIR /usr/app/typeorm

COPY package.json package-lock.json ./
RUN npm install

COPY . /usr/app/typeorm

CMD ["npm", "start"]

EXPOSE 3000
