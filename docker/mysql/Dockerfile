FROM mysql:latest

ENV - MYSQL_ROOT_PASSWORD=root

COPY mydb_users.sql /docker-entrypoint-initdb.d/
COPY mydb_cabinete.sql /docker-entrypoint-initdb.d/
COPY mydb_specializari.sql /docker-entrypoint-initdb.d/
COPY mydb_reviews.sql /docker-entrypoint-initdb.d/
COPY mydb_ratings.sql /docker-entrypoint-initdb.d/
COPY mydb_servicii.sql /docker-entrypoint-initdb.d/
COPY mydb_programari.sql /docker-entrypoint-initdb.d/
COPY mydb_programari_servicii.sql /docker-entrypoint-initdb.d/
COPY mydb_programari_users.sql /docker-entrypoint-initdb.d/
COPY mydb_roluri.sql /docker-entrypoint-initdb.d/
COPY mydb_roluri_users.sql /docker-entrypoint-initdb.d/


