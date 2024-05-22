FROM node:20.13-alpine3.19 AS build
COPY ./ /build
WORKDIR /build
RUN npm ci
RUN npm run build

FROM node:20.13-slim
ENV NODE_ENV=production
ENV APP_PORT=3000
EXPOSE 3000

COPY --from=build /build/dist/ /app
WORKDIR /app
CMD ["node", "--enable-source-maps", "index.js"]