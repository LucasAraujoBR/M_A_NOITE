import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import BackButton from "../Common/BackButton"; 
import HomeButton from "../Common/HomeButton"; 

const EditProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects_list/${projectId}`);
        setProject(response.data);
      } catch (error) {
        console.error('Erro ao buscar projeto', error);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.put(`/projects/${projectId}`, project);
      navigate('/projects');
    } catch (error) {
      console.error('Erro ao atualizar projeto', error);
    }
  };

  if (!project) return <div style={styles.loading}>Carregando...</div>;

  return (
    <div style={styles.container}>
      <HomeButton />
      <br></br>
      <BackButton />
      <h2 style={styles.title}>Editar Projeto</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          placeholder="Nome do Projeto"
          style={styles.input}
        />
        <textarea
          value={project.description}
          onChange={(e) => setProject({ ...project, description: e.target.value })}
          placeholder="Descrição do Projeto"
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>Atualizar Projeto</button>
      </form>
    </div>
  );
};

// Estilos CSS-in-JS
const styles = {
  container: {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  title: {
    fontSize: '22px',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    height: '100px',
    resize: 'none',
  },
  button: {
    padding: '10px 15px',
    fontSize: '16px',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.3s, transform 0.1s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  }
};

export default EditProject;
