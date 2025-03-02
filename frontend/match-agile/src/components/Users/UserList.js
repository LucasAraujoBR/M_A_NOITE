import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import BackButton from "../Common/BackButton";

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
    <div className="user-list-container">
      <BackButton />
      <h2>Usuários</h2>
      <Link to="/users/create" className="btn-create">Criar Novo Usuário</Link>
      <ul className="user-list">
        {users.map(user => (
          <li key={user.id} className="user-item">
            <div className="user-info">
              <span className="user-name">{user.name} ({user.email})</span>
            </div>
            <div className="user-actions">
              <button className="btn-delete" onClick={() => handleDelete(user.id)}>Deletar</button>
              <Link to={`/users/edit/${user.id}`} className="btn-edit">Editar</Link>
            </div>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .user-list-container {
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

        .user-list {
          list-style-type: none;
          padding: 0;
        }

        .user-item {
          background-color: #f9f9f9;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .user-info {
          font-size: 1rem;
          color: #333;
        }

        .user-actions {
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

export default UserList;
