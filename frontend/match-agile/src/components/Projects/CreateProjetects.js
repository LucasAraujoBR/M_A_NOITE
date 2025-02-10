import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { name, description };
    try {
      const response = await api.post('/projects', data);
      if (response.status === 201) {
        navigate('/projects');
      }
    } catch (error) {
      console.error('Erro ao criar projeto', error);
    }
  };

  return (
    <div>
      <h2>Criar Projeto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome do Projeto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Criar Projeto</button>
      </form>
    </div>
  );
};

export default CreateProject;
