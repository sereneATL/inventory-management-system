FROM node:20 as build-stage 

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

RUN npm run build

COPY . .
 
EXPOSE 3000
 
CMD [ "npm", "start" ]