FROM postgres:14  
ENV POSTGRES_PASSWORD=123L123
ENV POSTGRES_USER=admin
ENV POSTGRES_DB=database
COPY create_fixtures.sql /docker-entrypoint-initdb.d/create_fixtures.sql
