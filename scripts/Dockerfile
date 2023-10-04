FROM node:18-alpine as development
RUN apk --no-cache add curl
WORKDIR /app
COPY package.json ./
RUN yarn
COPY . /app
RUN mv .env.docker .env
CMD ["./start.sh"]
EXPOSE 3000
