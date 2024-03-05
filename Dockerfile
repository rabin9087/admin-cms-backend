FROM node:alpine
COPY . /adminApi
WORKDIR /adminApi
CMD node server.js