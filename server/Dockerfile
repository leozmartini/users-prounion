FROM node:18

WORKDIR /usr/src/app

RUN rm -rf node_modules package-lock.json

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV PORT=3000
ENV MYSQL_HOST=db
ENV MYSQL_PORT=3306
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=root
ENV MYSQL_DATABASE=users
ENV JWT_SECRET=prounion

EXPOSE 3000

CMD ["npm", "start"]
