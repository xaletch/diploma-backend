FROM nginx:stable-alpine
COPY backend.conf /etc/nginx/conf.d/backend.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
