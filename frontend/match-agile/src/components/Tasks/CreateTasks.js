import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [projectId, setProjectId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { title, description, category, project_id: projectId };
    try {
      const response = await api.post('/tasks', data);
      if (response.status === 201) {
        navigate('/tasks');
      }
    } catch (error) {
      console.error('Erro ao criar tarefa', error);
    }
  };

  return (
    <div>
      <h2>Criar Tarefa</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="ID do Projeto"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
        />
        <button type="submit">Criar Tarefa</button>
      </form>
    </div>
  );
};

export default CreateTask;
