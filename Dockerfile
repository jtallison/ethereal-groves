# Jesse Allison (2020)
# Ethereal-Groves
FROM node:13-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3000
# CMD node ./bin/www
CMD node ethereal-groves.js
