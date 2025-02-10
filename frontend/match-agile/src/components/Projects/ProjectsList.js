import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
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
    <div>
      <h2>Projetos</h2>
      <Link to="/projects/create">Criar Novo Projeto</Link>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            {project.name} ({project.description})
            <button onClick={() => handleDelete(project.id)}>Deletar</button>
            <Link to={`/projects/edit/${project.id}`}>Editar</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
