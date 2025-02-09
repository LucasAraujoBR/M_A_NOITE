import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditUser = () => {
  const { userId } = useParams();
  const history = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuário', error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.put(`/users/${userId}`, user);
      history.push('/users');
    } catch (error) {
      console.error('Erro ao atualizar usuário', error);
    }
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Editar Usuário</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          type="text"
          value={user.personality}
          onChange={(e) => setUser({ ...user, personality: e.target.value })}
        />
        <input
          type="text"
          value={user.level}
          onChange={(e) => setUser({ ...user, level: e.target.value })}
        />
        <input
          type="text"
          value={user.areas}
          onChange={(e) => setUser({ ...user, areas: e.target.value })}
        />
        <button type="submit">Atualizar Usuário</button>
      </form>
    </div>
  );
};

export default EditUser;
