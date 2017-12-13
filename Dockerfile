FROM node:8.9.1


WORKDIR /app
ADD . /app
RUN ls
RUN npm install

CMD [ "npm", "start" ]
EXPOSE 2999
