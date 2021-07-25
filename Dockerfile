FROM node:15-slim
WORKDIR /usr/src/app
COPY . ./
RUN npm ci
RUN npm run build:prod
CMD [ "node", "dist/index.js" ]
