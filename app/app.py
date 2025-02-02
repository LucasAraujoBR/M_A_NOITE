from flask import Flask, jsonify, request
import time
import random
from sqlalchemy import create_engine, text

# Configuração do banco de dados
db_name = 'database'
db_user = 'admin'
db_pass = '123L123'
db_host = 'db'
db_port = '5432'

# Conectar ao banco de dados
db_string = f'postgresql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}'
db = create_engine(db_string)

# Criando o aplicativo Flask
app = Flask(__name__)

# Função para adicionar um novo número ao banco de dados
def add_new_row(n):
    query = text("INSERT INTO numbers (number, timestamp) VALUES (:number, :timestamp)")
    with db.connect() as connection:
        connection.execute(query, {"number": n, "timestamp": int(round(time.time() * 1000))})

# Função para obter o último número inserido
def get_last_row():
    query = text("""
        SELECT number
        FROM numbers
        WHERE timestamp >= (SELECT max(timestamp) FROM numbers)
        LIMIT 1
    """)
    with db.connect() as connection:
        result_set = connection.execute(query)
        for r in result_set:
            return r[0]

# Rota para adicionar um número ao banco
@app.route('/add_number', methods=['POST'])
def add_number():
    try:
        data = request.get_json()
        number = data.get('number')
        if number is None:
            return jsonify({"error": "Number is required"}), 400

        add_new_row(number)
        return jsonify({"message": f"Number {number} added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Rota para obter o último número inserido
@app.route('/last_number', methods=['GET'])
def last_number():
    try:
        last_value = get_last_row()
        if last_value is None:
            return jsonify({"message": "No numbers found"}), 404
        return jsonify({"last_number": last_value}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Rota inicial
@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Number API!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
