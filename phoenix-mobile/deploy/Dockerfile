FROM node:20-alpine AS builder

WORKDIR /var/www/phoenix

COPY ./phoenix-mobile ./phoenix-mobile

COPY ./phoenix-game ./phoenix-game

WORKDIR /var/www/phoenix/phoenix-mobile

RUN npm install

RUN npm run build

FROM nginx:alpine

COPY ./phoenix-mobile/deploy/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /var/www/phoenix/phoenix-mobile/build /var/www/phoenix/mobile

EXPOSE 8080
