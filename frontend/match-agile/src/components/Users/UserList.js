import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Erro ao excluir usuário', error);
    }
  };

  return (
    <div>
      <h2>Usuários</h2>
      <Link to="/users/create">Criar Novo Usuário</Link>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email}) 
            <button onClick={() => handleDelete(user.id)}>Deletar</button>
            <Link to={`/users/edit/${user.id}`}>Editar</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
