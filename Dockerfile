FROM node:alpine AS builder

COPY . /silhouettes
WORKDIR /silhouettes
RUN yarn
RUN yarn build

FROM node:alpine

COPY --from=builder /silhouettes /silhouettes
WORKDIR /silhouettes

CMD ["node", "build"]
