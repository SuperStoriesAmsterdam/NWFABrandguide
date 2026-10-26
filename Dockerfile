FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY deploy/default.conf /etc/nginx/conf.d/default.conf
COPY deploy/.htpasswd /etc/nginx/.htpasswd
EXPOSE 80
