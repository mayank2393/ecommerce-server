FROM node:20-alpine

WORKDIR /app

# COPY package.json .
# COPY package-lock.json .
# COPY src .
COPY . .

RUN yarn install
RUN yarn build
RUN npx prisma generate

EXPOSE 4000

CMD ["node", "dist/index.js"]
