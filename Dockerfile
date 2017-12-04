FROM node:8.9.1
 
RUN mkdir -p /src
WORKDIR /src

COPY ./src/ /src
COPY .env /src
COPY package.json /src
COPY tsconfig.json /src
COPY README.md /src

RUN npm install --quiet

CMD [ "npm", "start" ]
