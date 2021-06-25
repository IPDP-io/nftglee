FROM node:alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN apk add git
RUN git clone https://github.com/asoltys/silhouettes-server /app

WORKDIR /app

RUN yarn install

CMD ["yarn", "start"]
