FROM nginx:alpine

# Static site: serve the dossier, the map page, and any pages added later
COPY index.html /usr/share/nginx/html/
COPY kaart.html /usr/share/nginx/html/
COPY js/ /usr/share/nginx/html/js/
COPY css/ /usr/share/nginx/html/css/
COPY data/ /usr/share/nginx/html/data/
COPY llms.txt /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
