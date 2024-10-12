FROM node:20 AS builder

WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM nginx:1-alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/build /var/www/sirius/build

