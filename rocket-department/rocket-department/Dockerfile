FROM node:18-alpine
ENV NODE_ENV development
WORKDIR /app
RUN apk update
COPY . /app
COPY package.json nest-cli.json yarn.lock ./
RUN yarn
RUN yarn build
CMD ["yarn", "start"]
EXPOSE 3000