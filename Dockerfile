FROM node:latest
RUN mkdir /backend
ADD . /backend
WORKDIR /backend
RUN npm i
EXPOSE 80
CMD ["npm", "start"]