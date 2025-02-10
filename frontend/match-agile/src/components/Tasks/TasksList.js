import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

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
    <div>
      <h2>Tarefas</h2>
      <Link to="/tasks/create">Criar Nova Tarefa</Link>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} ({task.category}) 
            <button onClick={() => handleDelete(task.id)}>Deletar</button>
            <Link to={`/tasks/edit/${task.id}`}>Editar</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
