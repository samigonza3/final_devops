FROM node:13.12.0-alpine

WORKDIR /usr/app
COPY package.json /usr/app/package.json
COPY package-lock.json /usr/app/package-lock.json
# install dependencies
RUN npm ci 
# copy base code
COPY . /usr/app/
EXPOSE 3000
CMD ["npm", "start"]