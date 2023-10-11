FROM node:18-alpine as development
RUN apk --no-cache add curl
WORKDIR /app
COPY package.json ./
RUN yarn
COPY --chown=node:node . /app
RUN mv .env.docker .env
CMD ["tail", "-f", "/dev/null"]
EXPOSE 3000
USER node
