import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import BackButton from "../Common/BackButton"; 


const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Erro ao buscar tarefas', error);
      }
    };
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Erro ao excluir tarefa', error);
    }
  };

  return (
    <div className="task-list-container">
      <BackButton />
      <h2>Tarefas</h2>
      <Link to="/tasks/create" className="btn-create">Criar Nova Tarefa</Link>
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className="task-item">
            <div className="task-info">
              <span className="task-title">{task.title}</span> 
              <span className="task-category">({task.category})</span>
            </div>
            <div className="task-actions">
              <button className="btn-delete" onClick={() => handleDelete(task.id)}>Deletar</button>
              <Link to={`/tasks/edit/${task.id}`} className="btn-edit">Editar</Link>
            </div>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .task-list-container {
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

        .task-list {
          list-style-type: none;
          padding: 0;
        }

        .task-item {
          background-color: #f9f9f9;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .task-info {
          font-size: 1rem;
          color: #333;
        }

        .task-actions {
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

export default TaskList;
