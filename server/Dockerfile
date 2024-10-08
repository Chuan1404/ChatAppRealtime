FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./build .
EXPOSE 3001
CMD ["npm", "start"]