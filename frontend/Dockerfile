FROM nginx:1.27.2

# Copiar los archivos HTML al directorio raíz de Nginx
COPY html/ /usr/share/nginx/html/

# Copiar los archivos CSS
COPY css/ /usr/share/nginx/html/css/

# Copiar los archivos JavaScript
COPY js/ /usr/share/nginx/html/js/

# Copiar los archivos estáticos (imágenes u otros recursos)
COPY Fotos/ /usr/share/nginx/html/Fotos/

# Puerto que usa Nginx
EXPOSE 80

# Iniciar el servidor Nginx
CMD ["nginx", "-g", "daemon off;"]