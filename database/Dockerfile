FROM postgres:14  
ENV POSTGRES_PASSWORD=123L123
ENV POSTGRES_USER=admin
ENV POSTGRES_DB=database

# Copiar arquivos de inicialização do banco
COPY init/*.sql /docker-entrypoint-initdb.d/
