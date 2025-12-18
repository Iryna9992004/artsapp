#dev
FROM node:22-slim AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --force
COPY . .
USER node

#build
FROM node:22-slim AS build
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build
ENV NODE_ENV=production
RUN npm install --force && npm cache clean --force
USER node

#prod
FROM node:22-slim AS production
WORKDIR /user/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
CMD ["node", "dist/main.js"]
