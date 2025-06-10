# Usa una imagen base oficial de PHP con Apache
FROM php:8.2-apache

# Instala dependencias del sistema
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev \
    libpq-dev libcurl4-openssl-dev nodejs npm gnupg

# Instala extensiones necesarias de PHP
RUN docker-php-ext-install pdo pdo_mysql

# Habilita mod_rewrite de Apache
RUN a2enmod rewrite

# Asegúrate de que Apache sirva desde el directorio correcto
RUN echo "DirectoryIndex index.php" >> /etc/apache2/apache2.conf

# Configura el DocumentRoot para usar la carpeta public de Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

# Actualiza la configuración de Apache para usar el nuevo DocumentRoot
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf

# Habilita el módulo de reescritura (en caso de que no se haya habilitado)
RUN a2enmod rewrite

# Establece el directorio de trabajo
WORKDIR /var/www/html

# Copia los archivos del proyecto al contenedor
COPY . .

# Establece el entorno de producción antes de instalar dependencias
ENV APP_ENV=production
ENV APP_DEBUG=false

# Instalar Composer de manera confiable
RUN curl -sS https://getcomposer.org/installer | php
RUN mv composer.phar /usr/local/bin/composer

# Instalar las dependencias de Composer
RUN composer install --no-dev --optimize-autoloader --verbose

# Instala Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Instala dependencias frontend y compila assets con Vite
RUN npm install && npm run build

# Ajusta permisos para asegurar que Apache tenga acceso
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Configura el puerto de Apache (en caso de que uses 8080 en vez de 80)
EXPOSE 8080

# Comando de inicio de Apache en primer plano
CMD ["apache2-foreground"]
