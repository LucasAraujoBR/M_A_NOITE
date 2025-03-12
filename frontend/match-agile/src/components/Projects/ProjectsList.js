import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import BackButton from "../Common/BackButton"; 


const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects/projects_list');
        setProjects(response.data);
      } catch (error) {
        console.error('Erro ao buscar projetos', error);
      }
    };
    fetchProjects();
  }, []);
  
  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Erro ao excluir projeto', error);
    }
  };
  
  return (
    <div className="project-list-container">
      <BackButton />
      <h2>Projetos</h2>
      <Link to="/projects/create" className="btn-create">Criar Novo Projeto</Link>
      <ul className="project-list">
        {projects.map(project => (
          <li key={project.id} className="project-item">
            <div className="project-info">
              <span className="project-name">{project.name}</span> 
              <span className="project-description">({project.description})</span>
            </div>
            <div className="project-actions">
              <button className="btn-delete" onClick={() => handleDelete(project.id)}>Deletar</button>
              <Link to={`/projects/edit/${project.id}`} className="btn-edit">Editar</Link>
            </div>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .project-list-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Arial', sans-serif;
        }

        h2 {
          text-align: center;
          color: #333;
          font-size: 2rem;
          margin-bottom: 20px;
        }

        .btn-create {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
          margin-bottom: 20px;
          transition: background-color 0.3s ease;
        }

        .btn-create:hover {
          background-color: #0056b3;
        }

        .project-list {
          list-style-type: none;
          padding: 0;
        }

        .project-item {
          background-color: #f9f9f9;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .project-info {
          font-size: 1rem;
          color: #333;
        }

        .project-actions {
          display: flex;
          gap: 10px;
        }

        .btn-delete {
          padding: 8px 15px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .btn-delete:hover {
          background-color: #c82333;
        }

        .btn-edit {
          padding: 8px 15px;
          background-color: #28a745;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .btn-edit:hover {
          background-color: #218838;
        }
      `}</style>
    </div>
  );
};

export default ProjectList;
