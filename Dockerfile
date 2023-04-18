FROM node:16.13
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install
RUN npm run build
RUN rm -rf /usr/src/app/.github
EXPOSE 3000
ENTRYPOINT [ "npm", "run", "dev" ]
