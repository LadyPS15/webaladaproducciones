# Usa una imagen base oficial de PHP con Apache
FROM php:7.4-apache

# Habilitar mod_rewrite para las URLs amigables (según tu archivo .htaccess)
RUN a2enmod rewrite

# Copiar el archivo .htaccess en el contenedor para que Apache lo utilice
COPY .htaccess /var/www/html/.htaccess

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /var/www/html

# Copiar los archivos del proyecto al contenedor
COPY . .

# Instalar dependencias necesarias para PHP (por ejemplo, zip)
RUN apt-get update && apt-get install -y libzip-dev && docker-php-ext-install zip

# Exponer el puerto 80 para el acceso web
EXPOSE 80

# Comando para iniciar Apache en primer plano
CMD ["apache2-foreground"]
