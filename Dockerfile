FROM node:22-bookworm-slim AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Default: drop-alert lander only. Unlock shop with build-arg later.
ARG VITE_STOREFRONT_UNLOCKED=false
ARG VITE_COMMERCE_API_URL=
ARG VITE_COMMERCE_PUBLISHABLE_KEY=
ENV VITE_STOREFRONT_UNLOCKED=$VITE_STOREFRONT_UNLOCKED \
    VITE_COMMERCE_API_URL=$VITE_COMMERCE_API_URL \
    VITE_COMMERCE_PUBLISHABLE_KEY=$VITE_COMMERCE_PUBLISHABLE_KEY

RUN npm run build

FROM nginx:1.27-alpine
COPY deploy/nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
