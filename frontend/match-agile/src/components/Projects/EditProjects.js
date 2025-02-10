import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EditProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${projectId}`);
        setProject(response.data);
      } catch (error) {
        console.error('Erro ao buscar projeto', error);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.put(`/projects/${projectId}`, project);
      navigate('/projects');
    } catch (error) {
      console.error('Erro ao atualizar projeto', error);
    }
  };

  if (!project) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Editar Projeto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          placeholder="Nome do Projeto"
        />
        <textarea
          value={project.description}
          onChange={(e) => setProject({ ...project, description: e.target.value })}
          placeholder="Descrição do Projeto"
        />
        <button type="submit">Atualizar Projeto</button>
      </form>
    </div>
  );
};

export default EditProject;
