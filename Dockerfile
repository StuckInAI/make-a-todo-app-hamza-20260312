FROM node:20-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i

COPY . .

RUN npm run build

RUN mkdir -p /app/data

EXPOSE 3000

CMD ["npm", "start"]
