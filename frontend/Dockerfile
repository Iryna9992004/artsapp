#dev
FROM node:22-slim AS development
WORKDIR /usr/app/src
COPY package*.json ./
RUN npm install --force
COPY . .
USER node

#build
FROM node:22-slim AS build
WORKDIR /usr/app/src
COPY package*.json ./
COPY --from=development /usr/app/src/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build
RUN npm install --force && npm cache clean --force
USER node

#prod
FROM node:22-slim AS production
WORKDIR /usr/app/src
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next


COPY --from=build /usr/app/src/.next/standalone ./
COPY --from=build /usr/app/src/.next/static ./.next/static
COPY --from=build /usr/app/src/public ./public
EXPOSE 3000
CMD ["node", "server.js"]