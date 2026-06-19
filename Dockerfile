# ---------- Stage 1: Build Angular ----------
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production --project report_builder_ui

# ---------- Stage 2: Nginx ----------
FROM nginx:stable-alpine

RUN rm -rf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/report_builder_ui/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8082

CMD ["nginx", "-g", "daemon off;"]
