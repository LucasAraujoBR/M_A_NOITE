import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Bem-vindo ao Match Agile</h1>
      <ul style={styles.list}>
        <li style={styles.listItem}><Link to="/users" style={styles.link}>Usuários</Link></li>
        <li style={styles.listItem}><Link to="/tasks" style={styles.link}>Tarefas</Link></li>
        <li style={styles.listItem}><Link to="/projects" style={styles.link}>Projetos</Link></li>
        <li style={styles.listItem}><Link to="/match_agile" style={styles.link}>Match Agile</Link></li>
      </ul>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f4f4f9',
  },
  heading: {
    color: '#333',
    fontSize: '2.5rem',
    marginBottom: '20px',
  },
  list: {
    listStyleType: 'none',
    padding: '0',
  },
  listItem: {
    margin: '10px 0',
  },
  link: {
    color: '#007bff',
    fontSize: '1.2rem',
    textDecoration: 'none',
    padding: '10px',
    display: 'inline-block',
    borderRadius: '5px',
    backgroundColor: '#e2e6ea',
    transition: 'background-color 0.3s ease',
  },
};

export default Home;
