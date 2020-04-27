FROM node:12-slim

WORKDIR /server
COPY . /server
RUN npm install --unsafe-perm

CMD [ "npm", "start" ]
