FROM node:21 AS builder
WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build-dev

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
