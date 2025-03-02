import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import BackButton from "../Common/BackButton"; 

const CreateProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const data = { name, description };
    try {
      const response = await api.post('/projects', data);
      if (response.status === 201) {
        navigate('/projects');
      }
    } catch (error) {
      console.error('Erro ao criar projeto', error);
    }
  };

  // Estilos CSS-in-JS
  const styles = {
    container: {
      maxWidth: '500px',
      margin: '40px auto',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
      textAlign: 'center'
    },
    title: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#333'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    input: {
      padding: '10px',
      fontSize: '16px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      outline: 'none'
    },
    textarea: {
      padding: '10px',
      fontSize: '16px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      minHeight: '100px',
      outline: 'none'
    },
    button: {
      padding: '10px',
      fontSize: '18px',
      backgroundColor: '#007BFF',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    buttonHover: {
      backgroundColor: '#0056b3'
    }
  };

  return (
    <div style={styles.container}>
      <BackButton />
      <h2 style={styles.title}>Criar Projeto</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome do Projeto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />
        <button 
          type="submit"
          style={styles.button}
          onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          Criar Projeto
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
