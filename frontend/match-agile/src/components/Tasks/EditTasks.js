import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import BackButton from '../Common/BackButton';

const EditTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/tasks/${taskId}`);
        setTask(response.data);
      } catch (error) {
        console.error('Erro ao buscar tarefa', error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Erro ao buscar projetos', error);
      }
    };

    fetchTask();
    fetchProjects();
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

  if (!task || projects.length === 0) return <div style={styles.loading}>Carregando...</div>;

  return (
    <div style={styles.container}>
      <BackButton />
      <div style={styles.card}>
        <h2 style={styles.heading}>Editar Tarefa</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              required
              style={styles.input}
              placeholder="Título"
            />
          </div>
          <div style={styles.inputGroup}>
            <textarea
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              required
              style={styles.textarea}
              placeholder="Descrição"
            />
          </div>
          <div style={styles.inputGroup}>
            <select
              value={task.category}
              onChange={(e) => setTask({ ...task, category: e.target.value })}
              required
              style={styles.select}
            >
              <option value="">Selecione uma Categoria</option>
              <option value="Backend">Backend</option>
              <option value="Frontend">Frontend</option>
              <option value="IA">IA</option>
              <option value="Design">Design</option>
              <option value="QA">QA</option>
            </select>
          </div>
          <div style={styles.inputGroup}>
            <select
              value={task.project_id}
              onChange={(e) => setTask({ ...task, project_id: e.target.value })}
              required
              style={styles.select}
            >
              <option value="">Selecione um Projeto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.button}>Atualizar Tarefa</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Estilos CSS-in-JS
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center',
  },
  heading: {
    color: '#343a40',
    fontSize: '1.8rem',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    alignItems: 'center',
  },
  inputGroup: {
    width: '100%',
  },
  input: {
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #ced4da',
    borderRadius: '8px',
    width: '100%',
    outline: 'none',
    transition: 'border 0.3s ease',
  },
  textarea: {
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #ced4da',
    borderRadius: '8px',
    width: '100%',
    height: '100px',
    outline: 'none',
    resize: 'none',
    transition: 'border 0.3s ease',
  },
  select: {
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #ced4da',
    borderRadius: '8px',
    width: '100%',
    outline: 'none',
    transition: 'border 0.3s ease',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1.1rem',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '50%',
    transition: 'background 0.3s ease, transform 0.2s',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#6c757d',
    marginTop: '20px',
  }
};

export default EditTask;
