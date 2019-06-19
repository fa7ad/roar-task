FROM node

RUN npm install pm2@3.2.2 --global --quiet
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN yarn

EXPOSE 5000

CMD ["pm2-runtime", "./config/pm2.json"]
