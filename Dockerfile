FROM node:21 AS builder
WORKDIR /app

COPY . .

RUN npm ci

# Build argument to decide between production and development build
ARG BUILD_TYPE

# Conditional run command based on BUILD_TYPE argument
RUN if [ "$BUILD_TYPE" = "main" ]; then \
      npm run build; \
    else \
      npm run build-dev; \
    fi

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
