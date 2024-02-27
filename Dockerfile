FROM node:19-alpine
RUN apk update && apk upgrade
RUN npm install -g  prisma 
WORKDIR /api
COPY package*.json .
RUN npm install 
COPY . .
EXPOSE 8080
RUN prisma generate
CMD [ "npm","start" ]