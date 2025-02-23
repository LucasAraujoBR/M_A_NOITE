import unittest
import requests

class TestSystem(unittest.TestCase):
    BASE_URL = "http://127.0.0.1:5000"

    def setUp(self):
        # Dados de teste para usuário
        self.user_data = {
            "name": "Teste User",
            "email": "testeaxt@example.com",
            "personality": ["Analítico"],
            "level": "Senior",
            "areas": ["Frontend"]
        }

        # Criar um usuário para os testes
        response = requests.post(f"{self.BASE_URL}/users", json=self.user_data)
        self.assertEqual(response.status_code, 201)
        self.user_id = response.json().get("id")

        # Criar um projeto fictício (caso precise)
        self.project_data = {
            "name": "Projeto Backend",
            "description": "Projeto para a API"
        }
        response = requests.post(f"{self.BASE_URL}/projects", json=self.project_data)
        self.assertEqual(response.status_code, 201)
        self.project_id = response.json().get("id")

        # # Dados de teste para tarefa (sem o project_id)
        self.task_data = {
            "title": "Implementar API",
            "description": "Criar endpoints rest para usuários e tarefas",
            "category": "Backend"
        }

        # Criar uma tarefa para os testes
        response = requests.post(f"{self.BASE_URL}/tasks", json=self.task_data)
        print(response.status_code)
        print(response.text)  # Exibir detalhes do erro
        self.assertEqual(response.status_code, 201)

        self.task_id = response.json().get("id")

        # Criar relação entre tarefa e projeto na tabela project_tasks
        relationship_data = {
            "task_id": self.task_id,
            "project_id": self.project_id
        }
        response = requests.post(f"{self.BASE_URL}/project_tasks", json=relationship_data)
        self.assertEqual(response.status_code, 201)

    def test_get_users(self):
        response = requests.get(f"{self.BASE_URL}/users")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(isinstance(response.json(), list))

    def test_get_user_by_id(self):
        response = requests.get(f"{self.BASE_URL}/users/{self.user_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], self.user_data["name"])

    def test_update_user(self):
        updated_data = self.user_data.copy()
        updated_data["name"] = "Teste User Atualizado"

        response = requests.put(f"{self.BASE_URL}/users/{self.user_id}", json=updated_data)
        self.assertEqual(response.status_code, 200)

        response = requests.get(f"{self.BASE_URL}/users/{self.user_id}")
        self.assertEqual(response.json()["name"], "Teste User Atualizado")

    def test_delete_user(self):
        response = requests.delete(f"{self.BASE_URL}/users/{self.user_id}")
        self.assertEqual(response.status_code, 200)

        # Confirmar que o usuário foi removido
        response = requests.get(f"{self.BASE_URL}/users/{self.user_id}")
        self.assertEqual(response.status_code, 404)

    def test_get_tasks(self):
        response = requests.get(f"{self.BASE_URL}/tasks")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(isinstance(response.json(), list))

    def test_get_task_by_id(self):
        response = requests.get(f"{self.BASE_URL}/tasks/{self.task_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["title"], self.task_data["title"])

    def test_update_task(self):
        updated_task_data = self.task_data.copy()
        updated_task_data["title"] = "Atualizar API"

        response = requests.put(f"{self.BASE_URL}/tasks/{self.task_id}", json=updated_task_data)
        self.assertEqual(response.status_code, 200)

        response = requests.get(f"{self.BASE_URL}/tasks/{self.task_id}")
        self.assertEqual(response.json()["title"], "Atualizar API")

    def test_delete_task(self):
        response = requests.delete(f"{self.BASE_URL}/tasks/{self.task_id}")
        self.assertEqual(response.status_code, 200)

        # Confirmar que a tarefa foi removida
        response = requests.get(f"{self.BASE_URL}/tasks/{self.task_id}")
        self.assertEqual(response.status_code, 404)
        
    def test_get_project_by_id(self):
        response = requests.get(f"{self.BASE_URL}/projects/{self.project_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], self.project_data["name"])

    def test_delete_project_by_id(self):
        response = requests.delete(f"{self.BASE_URL}/projects/{self.project_id}")
        self.assertEqual(response.status_code, 200)

        # Confirmar que a tarefa foi removida
        response = requests.get(f"{self.BASE_URL}/taprojectssks/{self.project_id}")
        self.assertEqual(response.status_code, 404)

    def tearDown(self):
        # Excluir usuário e tarefa criados durante os testes
        requests.delete(f"{self.BASE_URL}/users/{self.user_id}")
        requests.delete(f"{self.BASE_URL}/tasks/{self.task_id}")
        # Excluir o relacionamento na tabela project_tasks
        requests.delete(f"{self.BASE_URL}/project_tasks/{self.task_id}/{self.project_id}")
        # Excluir o projeto (se necessário)
        requests.delete(f"{self.BASE_URL}/projects/{self.project_id}")

if __name__ == '__main__':
    unittest.main()
