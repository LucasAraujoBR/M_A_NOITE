import time
import os
import io


import pandas as pd
from openai import AsyncOpenAI
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from flask import Flask, request, send_file
import io
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER, TA_LEFT


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
CORS(app)

# ---------------------------- EXPORT PDF / EXCEL -------------------------- #

@app.route('/generate_file', methods=['POST'])
def generate_file():
    data = request.json
    text = data.get('text', 'Sem conteúdo')
    file_type = data.get('file_type', 'pdf')

    if file_type == 'pdf':
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=60,
            bottomMargin=40
        )

        # Evitando conflito com estilos padrões
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(
            name='CustomTitle',
            fontSize=18,
            leading=22,
            alignment=TA_CENTER,
            spaceAfter=20
        ))
        styles.add(ParagraphStyle(
            name='CustomHeading',
            fontSize=14,
            leading=18,
            spaceBefore=12,
            spaceAfter=8,
            alignment=TA_LEFT
        ))
        styles.add(ParagraphStyle(
            name='CustomBodyText',
            fontSize=12,
            leading=15,
            alignment=TA_LEFT
        ))

        story = []

        # Se quiser adicionar um título principal fixo ao documento:
        story.append(Paragraph("Título do Documento", styles['CustomTitle']))
        story.append(Spacer(1, 12))

        # Processa o texto para separar por títulos
        sections = text.split("### ")
        for section in sections:
            if not section.strip():
                continue
            lines = section.strip().split("\n", 1)
            title = lines[0].strip()
            body = lines[1].strip() if len(lines) > 1 else ""

            # Adiciona o título e o corpo do texto no PDF
            story.append(Paragraph(title, styles['CustomHeading']))
            story.append(Spacer(1, 6))

            for paragraph in body.split("\n"):
                if paragraph.strip():
                    story.append(Paragraph(paragraph.strip(), styles['CustomBodyText']))
                    story.append(Spacer(1, 6))

            story.append(Spacer(1, 12))

        doc.build(story)
        buffer.seek(0)
        return send_file(
            buffer,
            as_attachment=True,
            download_name="output.pdf",
            mimetype='application/pdf'
        )

    elif file_type == 'excel':
        buffer = io.BytesIO()
        df = pd.DataFrame([[text]], columns=["Content"])
        with pd.ExcelWriter(buffer, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='Sheet1')
        buffer.seek(0)
        return send_file(
            buffer,
            as_attachment=True,
            download_name="output.xlsx",
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )

    return {"error": "Invalid file type"}, 400




# ---------------------------- OPENAI interação ---------------------------- #

@app.route('/projects/match-agile', methods=['POST'])
async def match_agile():
    try:
        data = request.get_json()

        project_id = data.get('project_id')
        user_ids = data.get('user_ids', [])  # Lista de IDs de usuários

        if not project_id or not user_ids:
            return jsonify({"error": "É necessário fornecer o ID do projeto e os IDs dos usuários."}), 400

        # Buscar projeto com tarefas usando a tabela intermediária project_tasks
        project_query = text("""
            SELECT 
                p.id, 
                p.name, 
                p.description, 
                json_agg(json_build_object('id', t.id, 'title', t.title, 'description', t.description, 'category', t.category)) AS tasks
            FROM projects p
            JOIN project_tasks pt ON p.id = pt.project_id
            JOIN tasks t ON pt.task_id = t.id
            WHERE p.id = :id
            GROUP BY p.id, p.name, p.description
        """)

        # Buscar usuários específicos
        users_query = text("""
            SELECT id, name, email, personality, level, areas 
            FROM users 
            WHERE id IN :user_ids
        """)

        with db.connect() as connection:
            project_result = connection.execute(project_query, {"id": project_id}).fetchone()
            users_result = connection.execute(users_query, {"user_ids": tuple(user_ids)}).fetchall()

            if not project_result:
                return jsonify({"error": "Projeto não encontrado"}), 404

            if not users_result:
                return jsonify({"error": "Nenhum usuário encontrado com os IDs fornecidos"}), 404

            project = dict(project_result._mapping)
            users = [dict(row._mapping) for row in users_result]

        client = AsyncOpenAI(api_key=os.getenv('API_KEY_GPT', 'insira_chave_gpt_aqui'))

        # Montar payload para o GPT
        prompt = {
            "system": "Você é um especialista em metodologias ágeis e alocação de talentos.",
            "content": f"""
                Dado o seguinte projeto com suas tarefas:
                {project}

                E os seguintes usuários com suas características:
                {users}

                Crie um relatório 'match agile' que relacione os usuários às tarefas de maneira inteligente e prática, considerando as competências, personalidades e áreas de atuação.
                Inclua insights estratégicos para otimizar a entrega do projeto. Lembre-se todos os usuários precisam ser alocados em pelo menos uma tarefa, mesmo que sejam auxliandos por outro.
            """,
            "output_limit_text": "O relatório deve ser objetivo, com insights claros e direcionados."
        }
        
        # Chamar a API do GPT de forma assíncrona
        response = await client.chat.completions.create(
            model="gpt-4o-mini-2024-07-18",
            messages=[
                {"role": "system", "content": prompt["system"]},
                {"role": "user", "content": prompt["content"]}
            ],
            max_tokens=1000
        )

        return jsonify(response.choices[0].message.content), 200

    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao buscar dados do banco", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Erro ao gerar relatório com GPT", "details": str(e)}), 500


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
#
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

    # Verifica se o 'personality' é uma string e converte para lista
    if isinstance(data['personality'], str):
        data['personality'] = [item.strip() for item in data['personality'].split(',')]

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


# ---------------------------- CRUD Tarefas ---------------------------- #

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    required_fields = ['title', 'description', 'category']
    missing_fields = [field for field in required_fields if field not in data or not data[field]]
    if missing_fields:
        return jsonify({"error": f"Campos obrigatórios ausentes: {', '.join(missing_fields)}"}), 400

    query = text("""
        INSERT INTO tasks (title, description, category)
        VALUES (:title, :description, :category)
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
    query = text("SELECT id, title, description, category FROM tasks")

    try:
        with db.connect() as connection:
            result = connection.execute(query)
            tasks = [dict(row._mapping) for row in result]
        return jsonify(tasks), 200

    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao buscar tarefas", "details": str(e)}), 500

@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    query = text("SELECT id, title, description, category FROM tasks WHERE id = :id")

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
    allowed_fields = ['title', 'description', 'category']
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
    query = text("""
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            json_agg(json_build_object('id', t.id, 'title', t.title, 'description', t.description, 'category', t.category)) AS tasks
        FROM projects p
        JOIN project_tasks pt ON p.id = pt.project_id
        JOIN tasks t ON pt.task_id = t.id
        GROUP BY p.id, p.name, p.description
    """)
    try:
        with db.connect() as connection:
            result = connection.execute(query)
            projects = [dict(row._mapping) for row in result]
        return jsonify(projects), 200
    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao buscar projetos", "details": str(e)}), 500

@app.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    query = text("""
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            json_agg(json_build_object('id', t.id, 'title', t.title, 'description', t.description, 'category', t.category)) AS tasks
        FROM projects p
        JOIN project_tasks pt ON p.id = pt.project_id
        JOIN tasks t ON pt.task_id = t.id
        WHERE p.id = :id
        GROUP BY p.id, p.name, p.description
    """)
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

# ---------------------------- Crud Project_tasks ---------------------- #

@app.route('/project_tasks', methods=['POST'])
def create_project_task():
    data = request.get_json()
    if 'project_id' not in data or 'task_id' not in data:
        return jsonify({"error": "Campos 'project_id' e 'task_id' são obrigatórios"}), 400

    query = text("""
        INSERT INTO project_tasks (project_id, task_id) 
        VALUES (:project_id, :task_id)
    """)
    try:
        with db.connect() as connection:
            connection.execute(query, data)
            connection.commit()
        return jsonify({"message": "Relação projeto-tarefa criada"}), 201
    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao criar relação", "details": str(e)}), 500

@app.route('/project_tasks', methods=['GET'])
def get_project_tasks():
    query = text("""
        SELECT project_id, task_id FROM project_tasks
    """)
    try:
        with db.connect() as connection:
            result = connection.execute(query)
            project_tasks = [dict(row._mapping) for row in result]
        return jsonify(project_tasks), 200
    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao buscar relações", "details": str(e)}), 500

@app.route('/project_tasks/<int:project_id>', methods=['GET'])
def get_project_tasks_by_project(project_id):
    query = text("""
        SELECT task_id FROM project_tasks WHERE project_id = :project_id
    """)
    try:
        with db.connect() as connection:
            result = connection.execute(query, {"project_id": project_id})
            tasks = [row.task_id for row in result]
        return jsonify({"project_id": project_id, "tasks": tasks}), 200
    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao buscar tarefas do projeto", "details": str(e)}), 500

@app.route('/project_tasks', methods=['DELETE'])
def delete_project_task():
    data = request.get_json()
    if 'project_id' not in data or 'task_id' not in data:
        return jsonify({"error": "Campos 'project_id' e 'task_id' são obrigatórios"}), 400

    query = text("""
        DELETE FROM project_tasks WHERE project_id = :project_id AND task_id = :task_id
    """)
    try:
        with db.connect() as connection:
            result = connection.execute(query, data)
            if result.rowcount == 0:
                return jsonify({"error": "Relação não encontrada"}), 404
            connection.commit()
        return jsonify({"message": "Relação projeto-tarefa removida"}), 200
    except SQLAlchemyError as e:
        return jsonify({"error": "Erro ao remover relação", "details": str(e)}), 500


# ---------------------------- Rota inicial ---------------------------- #

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the API!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
