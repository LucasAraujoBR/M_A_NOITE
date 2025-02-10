import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate  } from 'react-router-dom';

const CreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [personality, setPersonality] = useState('');
  const [level, setLevel] = useState('');
  const [areas, setAreas] = useState([]);
  const history = useNavigate ();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { name, email, personality: [personality], level, areas: areas.split(',') };
    try {
      const response = await api.post('/users', data);
      if (response.status === 201) {
        history.push('/users');
      }
    } catch (error) {
      console.error('Erro ao criar usuário', error);
    }
  };

  return (
    <div>
      <h2>Criar Usuário</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Personalidade"
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nível"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Áreas (separadas por vírgula)"
          value={areas}
          onChange={(e) => setAreas(e.target.value)}
          required
        />
        <button type="submit">Criar Usuário</button>
      </form>
    </div>
  );
};

export default CreateUser;
