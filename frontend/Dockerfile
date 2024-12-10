FROM nginx:1.25

# Establecer el directorio de trabajo en Nginx
WORKDIR /usr/share/nginx/html

# Eliminar los archivos por defecto de Nginx
RUN rm -rf ./*

# Copiar el contenido del directorio actual (donde está el Dockerfile)
COPY ./ /usr/share/nginx/html/

EXPOSE 80

# Configuración por defecto de Nginx
CMD ["nginx", "-g", "daemon off;"]