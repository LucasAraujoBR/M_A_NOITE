from flask import Flask, jsonify, request
import time
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

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

    # Validação dos campos obrigatórios
    required_fields = ['name', 'email', 'personality', 'level', 'areas']
    missing_fields = [field for field in required_fields if field not in data or not data[field]]

    if missing_fields:
        return jsonify({"error": f"Campos obrigatórios ausentes: {', '.join(missing_fields)}"}), 400

    query = text("""
        INSERT INTO users (name, email, personality, level, areas)
        VALUES (:name, :email, :personality, :level, :areas)
        RETURNING id
    """)

    try:
        with db.connect() as connection:
            result = connection.execute(query, {
                "name": data['name'],
                "email": data['email'],
                "personality": data['personality'],
                "level": data['level'],
                "areas": data['areas']
            })
            user_id = result.fetchone()

            if user_id is None:
                raise Exception("Falha ao obter o ID do usuário criado.")

            connection.commit()

        return jsonify({"message": "User created", "id": user_id[0]}), 201

    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao inserir usuário no banco de dados", "details": str(e)}), 500

    except Exception as e:
        return jsonify({"error": "Erro inesperado", "details": str(e)}), 500

@app.route('/users', methods=['GET'])
def get_users():
    query = text("SELECT id, name, email, personality, level, areas FROM users")  # Seleção explícita dos campos

    try:
        with db.connect() as connection:
            result = connection.execute(query)
            users = [dict(row._mapping) for row in result]  # Garante compatibilidade

        return jsonify(users), 200

    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao buscar usuários", "details": str(e)}), 500

    except Exception as e:
        return jsonify({"error": "Erro inesperado", "details": str(e)}), 500

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    query = text("SELECT id, name, email, personality, level, areas FROM users WHERE id = :id")

    try:
        with db.connect() as connection:
            result = connection.execute(query, {"id": user_id}).fetchone()
            if result:
                return jsonify(dict(result._mapping)), 200  # Garante compatibilidade
            return jsonify({"error": "User not found"}), 404

    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao buscar usuário", "details": str(e)}), 500

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()

    # Validação dos campos obrigatórios
    required_fields = ['name', 'email', 'personality', 'level', 'areas']
    missing_fields = [field for field in required_fields if field not in data or not data[field]]

    if missing_fields:
        return jsonify({"error": f"Campos obrigatórios ausentes: {', '.join(missing_fields)}"}), 400

    # Verifica se o usuário existe antes de atualizar
    check_query = text("SELECT id FROM users WHERE id = :id")
    update_query = text("""
        UPDATE users 
        SET name = :name, email = :email, personality = :personality, level = :level, areas = :areas
        WHERE id = :id
    """)

    try:
        with db.connect() as connection:
            result = connection.execute(check_query, {"id": user_id}).fetchone()
            if not result:
                return jsonify({"error": "User not found"}), 404

            connection.execute(update_query, {
                "id": user_id, "name": data['name'], "email": data['email'],
                "personality": data['personality'], "level": data['level'], "areas": data['areas']
            })
            connection.commit()

        return jsonify({"message": "User updated"}), 200

    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao atualizar usuário", "details": str(e)}), 500

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    # Verifica se o usuário existe antes de excluir
    check_query = text("SELECT id FROM users WHERE id = :id")
    delete_query = text("DELETE FROM users WHERE id = :id")

    try:
        with db.connect() as connection:
            result = connection.execute(check_query, {"id": user_id}).fetchone()
            if not result:
                return jsonify({"error": "User not found"}), 404

            connection.execute(delete_query, {"id": user_id})
            connection.commit()

        return jsonify({"message": "User deleted"}), 200

    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao excluir usuário", "details": str(e)}), 500

from sqlalchemy.exc import SQLAlchemyError

# ---------------------------- CRUD Tarefas ---------------------------- #

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    required_fields = ['title', 'description', 'category', 'project_id']
    missing_fields = [field for field in required_fields if field not in data or not data[field]]
    if missing_fields:
        return jsonify({"error": f"Campos obrigatórios ausentes: {', '.join(missing_fields)}"}), 400

    query = text("""
        INSERT INTO tasks (title, description, category, project_id)
        VALUES (:title, :description, :category, :project_id)
        RETURNING id
    """)
    try:
        with db.connect() as connection:
            result = connection.execute(query, data)
            task_id = result.fetchone()[0]
            connection.commit()
        return jsonify({"message": "Task created", "id": task_id}), 201
    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao criar tarefa", "details": str(e)}), 500


@app.route('/tasks', methods=['GET'])
def get_tasks():
    query = text("SELECT id, title, description, category, project_id FROM tasks")

    try:
        with db.connect() as connection:
            result = connection.execute(query)
            tasks = [dict(row._mapping) for row in result]
        return jsonify(tasks), 200

    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao buscar tarefas", "details": str(e)}), 500

@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    query = text("SELECT id, title, description, category, project_id FROM tasks WHERE id = :id")

    try:
        with db.connect() as connection:
            result = connection.execute(query, {"id": task_id}).fetchone()
            if result:
                return jsonify(dict(result._mapping)), 200
            return jsonify({"error": "Task not found"}), 404

    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao buscar tarefa", "details": str(e)}), 500

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    allowed_fields = ['title', 'description', 'category', 'project_id']
    fields_to_update = {key: value for key, value in data.items() if key in allowed_fields and value}

    if not fields_to_update:
        return jsonify({"error": "Nenhum campo válido para atualização"}), 400

    check_query = text("SELECT id FROM tasks WHERE id = :id")
    update_query = text(f"""
        UPDATE tasks 
        SET {', '.join(f"{key} = :{key}" for key in fields_to_update.keys())}
        WHERE id = :id
    """)

    try:
        with db.connect() as connection:
            result = connection.execute(check_query, {"id": task_id}).fetchone()
            if not result:
                return jsonify({"error": "Task not found"}), 404

            fields_to_update["id"] = task_id
            connection.execute(update_query, fields_to_update)
            connection.commit()

        return jsonify({"message": "Task updated"}), 200

    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao atualizar tarefa", "details": str(e)}), 500

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    check_query = text("SELECT id FROM tasks WHERE id = :id")
    delete_query = text("DELETE FROM tasks WHERE id = :id")

    try:
        with db.connect() as connection:
            result = connection.execute(check_query, {"id": task_id}).fetchone()
            if not result:
                return jsonify({"error": "Task not found"}), 404

            connection.execute(delete_query, {"id": task_id})
            connection.commit()

        return jsonify({"message": "Task deleted"}), 200

    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao excluir tarefa", "details": str(e)}), 500
    
    
# ---------------------------- CRUD Projetos ---------------------------- #
@app.route('/projects', methods=['POST'])
def create_project():
    data = request.get_json()
    if 'name' not in data or not data['name']:
        return jsonify({"error": "Nome do projeto é obrigatório"}), 400

    query = text("INSERT INTO projects (name, description) VALUES (:name, :description) RETURNING id")
    try:
        with db.connect() as connection:
            result = connection.execute(query, data)
            project_id = result.fetchone()[0]
            connection.commit()
        return jsonify({"message": "Project created", "id": project_id}), 201
    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao criar projeto", "details": str(e)}), 500

@app.route('/projects', methods=['GET'])
def get_projects():
    query = text("SELECT id, name, description FROM projects")
    try:
        with db.connect() as connection:
            result = connection.execute(query)
            projects = [dict(row._mapping) for row in result]
        return jsonify(projects), 200
    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao buscar projetos", "details": str(e)}), 500

@app.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    query = text("SELECT id, name, description FROM projects WHERE id = :id")
    try:
        with db.connect() as connection:
            result = connection.execute(query, {"id": project_id}).fetchone()
            if result:
                return jsonify(dict(result._mapping)), 200
            return jsonify({"error": "Projeto não encontrado"}), 404
    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao buscar projeto", "details": str(e)}), 500

@app.route('/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    data = request.get_json()
    allowed_fields = ['name', 'description']
    fields_to_update = {key: value for key, value in data.items() if key in allowed_fields and value}

    if not fields_to_update:
        return jsonify({"error": "Nenhum campo válido para atualização"}), 400

    check_query = text("SELECT id FROM projects WHERE id = :id")
    update_query = text(f"""
        UPDATE projects 
        SET {', '.join(f"{key} = :{key}" for key in fields_to_update.keys())}
        WHERE id = :id
    """)

    try:
        with db.connect() as connection:
            result = connection.execute(check_query, {"id": project_id}).fetchone()
            if not result:
                return jsonify({"error": "Projeto não encontrado"}), 404

            fields_to_update["id"] = project_id
            connection.execute(update_query, fields_to_update)
            connection.commit()

        return jsonify({"message": "Projeto atualizado"}), 200
    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao atualizar projeto", "details": str(e)}), 500

@app.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    check_query = text("SELECT id FROM projects WHERE id = :id")
    delete_query = text("DELETE FROM projects WHERE id = :id")

    try:
        with db.connect() as connection:
            result = connection.execute(check_query, {"id": project_id}).fetchone()
            if not result:
                return jsonify({"error": "Projeto não encontrado"}), 404

            connection.execute(delete_query, {"id": project_id})
            connection.commit()

        return jsonify({"message": "Projeto excluído"}), 200
    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao excluir projeto", "details": str(e)}), 500
# ---------------------------- Rota inicial ---------------------------- #

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the API!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
