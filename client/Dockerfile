FROM node:18

WORKDIR /usr/src/app

RUN rm -rf node_modules package-lock.json

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
