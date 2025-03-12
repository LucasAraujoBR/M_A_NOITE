import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import BackButton from '../Common/BackButton';
import HomeButton from '../Common/HomeButton';

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects/projects_list');
        setProjects(response.data);
      } catch (error) {
        console.error('Erro ao buscar projetos', error);
      }
    };
    fetchProjects();
  }, []);

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
    <div style={styles.container}>
      <HomeButton />
      <br></br>
      <BackButton />
      <div style={styles.card}>
        <h2 style={styles.heading}>Criar Tarefa</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.textarea}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={styles.select}
          >
            <option value="" disabled>Selecione uma categoria</option>
            <option value="Backend">Backend</option>
            <option value="Frontend">Frontend</option>
            <option value="IA">IA</option>
            <option value="Design">Design</option>
            <option value="QA">QA</option>
          </select>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            style={styles.select}
          >
            <option value="" disabled>Selecione um projeto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <button type="submit" style={styles.button}>Criar Tarefa</button>
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
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
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
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1.1rem',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s ease, transform 0.2s',
  }
};

export default CreateTask;
