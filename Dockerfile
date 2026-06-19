FROM php:8.2-apache

WORKDIR /var/www/html

RUN docker-php-ext-install pdo_mysql \
    && a2enmod rewrite \
    && printf 'ServerName localhost\n' > /etc/apache2/conf-available/servername.conf \
    && a2enconf servername \
    && printf 'date.timezone=America/Sao_Paulo\n' > /usr/local/etc/php/conf.d/timezone.ini

COPY docker/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY docker/php-entrypoint.sh /usr/local/bin/app-entrypoint
RUN chmod +x /usr/local/bin/app-entrypoint

COPY . /var/www/html

ENTRYPOINT ["app-entrypoint"]
CMD ["apache2-foreground"]
