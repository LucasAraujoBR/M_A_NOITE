import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EditTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/tasks/${taskId}`);
        setTask(response.data);
      } catch (error) {
        console.error('Erro ao buscar tarefa', error);
      }
    };
    fetchTask();
  }, [taskId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.put(`/tasks/${taskId}`, task);
      navigate('/tasks');
    } catch (error) {
      console.error('Erro ao atualizar tarefa', error);
    }
  };

  if (!task) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Editar Tarefa</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />
        <input
          type="text"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />
        <input
          type="text"
          value={task.category}
          onChange={(e) => setTask({ ...task, category: e.target.value })}
        />
        <input
          type="number"
          value={task.project_id}
          onChange={(e) => setTask({ ...task, project_id: e.target.value })}
        />
        <button type="submit">Atualizar Tarefa</button>
      </form>
    </div>
  );
};

export default EditTask;
