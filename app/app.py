from flask import Flask, jsonify, request
import time
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

# ---------------------------- CRUD Usuários ---------------------------- #

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    query = text("""
        INSERT INTO users (name, email, skills, level, areas)
        VALUES (:name, :email, :skills, :level, :areas)
        RETURNING id
    """)
    with db.connect() as connection:
        result = connection.execute(query, {
            "name": data['name'], "email": data['email'],
            "skills": data['skills'], "level": data['level'], "areas": data['areas']
        })
        connection.commit()
        user_id = result.fetchone()[0]
    return jsonify({"message": "User created", "id": user_id}), 201

@app.route('/users', methods=['GET'])
def get_users():
    query = text("SELECT * FROM users")
    with db.connect() as connection:
        result = connection.execute(query)
        users = [dict(row) for row in result]
    return jsonify(users)

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    query = text("SELECT * FROM users WHERE id = :id")
    with db.connect() as connection:
        result = connection.execute(query, {"id": user_id}).fetchone()
        if result:
            return jsonify(dict(result))
        return jsonify({"error": "User not found"}), 404

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    query = text("""
        UPDATE users SET name=:name, email=:email, skills=:skills, level=:level, areas=:areas
        WHERE id=:id
    """)
    with db.connect() as connection:
        connection.execute(query, {
            "id": user_id, "name": data['name'], "email": data['email'],
            "skills": data['skills'], "level": data['level'], "areas": data['areas']
        })
    return jsonify({"message": "User updated"})

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    query = text("DELETE FROM users WHERE id = :id")
    with db.connect() as connection:
        connection.execute(query, {"id": user_id})
    return jsonify({"message": "User deleted"})

# ---------------------------- CRUD Tarefas ---------------------------- #

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    query = text("""
        INSERT INTO tasks (title, description, category)
        VALUES (:title, :description, :category)
        RETURNING id
    """)
    with db.connect() as connection:
        result = connection.execute(query, {
            "title": data['title'], "description": data['description'], "category": data['category']
        })
        task_id = result.fetchone()[0]
    return jsonify({"message": "Task created", "id": task_id}), 201

@app.route('/tasks', methods=['GET'])
def get_tasks():
    query = text("SELECT * FROM tasks")
    with db.connect() as connection:
        result = connection.execute(query)
        tasks = [dict(row) for row in result]
    return jsonify(tasks)

@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    query = text("SELECT * FROM tasks WHERE id = :id")
    with db.connect() as connection:
        result = connection.execute(query, {"id": task_id}).fetchone()
        if result:
            return jsonify(dict(result))
        return jsonify({"error": "Task not found"}), 404

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    query = text("""
        UPDATE tasks SET title=:title, description=:description, category=:category
        WHERE id=:id
    """)
    with db.connect() as connection:
        connection.execute(query, {
            "id": task_id, "title": data['title'], "description": data['description'], "category": data['category']
        })
    return jsonify({"message": "Task updated"})

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    query = text("DELETE FROM tasks WHERE id = :id")
    with db.connect() as connection:
        connection.execute(query, {"id": task_id})
    return jsonify({"message": "Task deleted"})

# ---------------------------- Rota inicial ---------------------------- #

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the API!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
