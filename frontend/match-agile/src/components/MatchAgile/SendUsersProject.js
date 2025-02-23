import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ProjectUserSelect = () => {
  const [projects, setProjects] = useState([]); // Para armazenar os projetos disponíveis
  const [users, setUsers] = useState([]); // Para armazenar todos os usuários
  const [selectedUsers, setSelectedUsers] = useState([]); // Para armazenar os usuários selecionados
  const [selectedProject, setSelectedProject] = useState(''); // Para armazenar o projeto escolhido
  const [loading, setLoading] = useState(false); // Para controlar o estado de carregamento
  const [responseMessage, setResponseMessage] = useState(''); // Para armazenar a resposta da API

  // Carregar projetos e usuários no useEffect
  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      try {
        const projectsResponse = await api.get('/projects'); // Ajuste para a sua API de projetos
        setProjects(projectsResponse.data);

        const usersResponse = await api.get('/users');
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Erro ao carregar projetos ou usuários', error);
      }
    };

    fetchProjectsAndUsers();
  }, []);

  // Função para alternar seleção de usuários
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  // Função para enviar dados ao backend
  const handleSubmit = async () => {
    if (!selectedProject || selectedUsers.length === 0) {
      alert('Por favor, escolha um projeto e selecione pelo menos um usuário.');
      return;
    }

    setLoading(true); // Inicia o carregamento

    try {
      const payload = {
        project: selectedProject,
        users: selectedUsers,
      };

      const response = await api.post('http://127.0.0.1:5000/projects/match-agile', payload);
      setResponseMessage(response.data.message || 'Usuários enviados com sucesso!'); // Armazena a mensagem retornada da API
    } catch (error) {
      console.error('Erro ao enviar dados', error);
      setResponseMessage('Ocorreu um erro ao enviar os dados.');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Selecionar Usuários para o Projeto</h2>

      <div style={styles.selectContainer}>
        <label htmlFor="project-select" style={styles.label}>Escolha um Projeto:</label>
        <select
          id="project-select"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          style={styles.select}
        >
          <option value="">Selecione um projeto</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <h3 style={styles.subHeading}>Usuários</h3>
      <ul style={styles.userList}>
        {users.map((user) => (
          <li key={user.id} style={styles.userItem}>
            <input
              type="checkbox"
              checked={selectedUsers.includes(user.id)}
              onChange={() => toggleUserSelection(user.id)}
              style={styles.checkbox}
            />
            <span style={styles.userName}>{user.name} ({user.email})</span>
          </li>
        ))}
      </ul>

      <button onClick={handleSubmit} disabled={loading} style={styles.button}>
        {loading ? 'Carregando...' : 'Enviar para o Projeto'}
      </button>

      {/* Pop-up de mensagem */}
      {responseMessage && (
        <div style={styles.popup}>
          <p>{responseMessage}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '50px auto',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    fontSize: '2rem',
    marginBottom: '20px',
  },
  subHeading: {
    color: '#555',
    fontSize: '1.5rem',
    marginBottom: '10px',
  },
  selectContainer: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#444',
    fontSize: '1rem',
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  userList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    padding: '5px 0',
    borderBottom: '1px solid #eee',
  },
  checkbox: {
    marginRight: '10px',
  },
  userName: {
    fontSize: '1rem',
    color: '#555',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '12px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '12px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  popup: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
  },
};

export default ProjectUserSelect;
