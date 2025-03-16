import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import BackButton from "../Common/BackButton";
import HomeButton from "../Common/HomeButton";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await api.get(`/projects_assembled/${projectId}`);
        setProject(response.data[0]); // A resposta parece ser uma lista, então pegamos o primeiro item
      } catch (error) {
        console.error("Erro ao buscar os dados do projeto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!project) {
    return <div className="not-found">Projeto não encontrado.</div>;
  }

  return (
    <div className="project-details">
      <style>
        {`
          .project-details {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            max-width: 900px;
            margin: 40px auto;
            color: #333;
          }
          .project-details h3 {
            color: #333;
            font-size: 26px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: bold;
          }
          .project-details .strong {
            font-size: 16px;
            color: #555;
            font-weight: 600;
          }
          .project-details ul {
            list-style-type: none;
            padding-left: 0;
            margin: 10px 0;
          }
          .project-details li {
            margin-bottom: 12px;
            color: #444;
            font-size: 15px;
            line-height: 1.5;
          }
          .project-details .empty-message {
            color: #888;
            font-style: italic;
          }
          .loading, .not-found {
            font-size: 18px;
            color: #ff6347;
            text-align: center;
          }
          .project-details button {
            margin-top: 20px;
          }
          .project-details .button-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .project-details .button-container button {
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .project-details .button-container button:hover {
            background-color: #0056b3;
          }
          .project-details .button-container button:focus {
            outline: none;
          }
        `}
      </style>

      <div className="button-container">
        <HomeButton />
        <BackButton />
      </div>

      <h3>Usuários e Tarefas de {project.name}</h3>

      <div>
        <strong className="strong">Usuários:</strong>
        <ul>
          {project.users && project.users.length > 0 ? (
            project.users.map((user) => (
              <li key={user.id}>
                {user.name} ({user.email})
              </li>
            ))
          ) : (
            <li className="empty-message">Nenhum usuário encontrado.</li>
          )}
        </ul>
      </div>

      <div>
        <strong className="strong">Tarefas:</strong>
        <ul>
          {project.tasks && project.tasks.length > 0 ? (
            project.tasks.map((task) => (
              <li key={task.id}>
                {task.title} - {task.category}
              </li>
            ))
          ) : (
            <li className="empty-message">Nenhuma tarefa encontrada.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProjectDetails;
