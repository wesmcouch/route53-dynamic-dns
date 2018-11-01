from node:8

WORKDIR /usr/src/app

COPY package*.json ./
COPY index.js ./index.js

RUN npm install

CMD [ 'node', 'index.js' ]