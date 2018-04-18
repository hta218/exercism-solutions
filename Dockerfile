FROM node:carbon

MAINTAINER jujien

WORKDIR /home/server/api
ADD package-lock.json package-lock.json
ADD package.json package.json
ADD bin/ bin/
ADD models/ models/
ADD public/ public/
ADD routes/ routes/
ADD settings/ settings/
ADD views/ views/
ADD middleware/ middleware/ 
ADD app.js app.js
ADD apidoc.json apidoc.json

RUN npm install
EXPOSE 5000
CMD [ "node", "app.js" ]
