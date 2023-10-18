FROM node:18-alpine as development
RUN apk --no-cache add curl
WORKDIR /app
COPY --chown=node:node package.json ./
RUN yarn
COPY --chown=node:node . /app
RUN mv .env.docker .env
RUN chmod u+x ./start.sh
CMD ["tail", "-f", "/dev/null"]
EXPOSE 3010
USER node
