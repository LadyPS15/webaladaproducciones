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

# Establece el directorio de trabajo
WORKDIR /var/www/html

# Copia los archivos del proyecto al contenedor
COPY . .

# Establece el entorno de producción antes de instalar dependencias
ENV APP_ENV=production
ENV APP_DEBUG=false

# Instala Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Instala Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Instala dependencias frontend y compila assets con Vite
RUN npm install && npm run build

# Ajusta permisos
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Cambia la configuración de Apache para servir desde /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf

# Expone el puerto por defecto de Apache
EXPOSE 80

# Comando de inicio
CMD ["apache2-foreground"]
