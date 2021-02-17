FROM node:12-alpine
WORKDIR app
ADD package.json package.json
RUN npm install
ADD index.js index.js
ENTRYPOINT ["node", "index.js"]
