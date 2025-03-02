import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.heading}>Bem-vindo ao Match Agile</h1>
        <p style={styles.subtitle}>
          Conectamos **usuários, tarefas e projetos** de forma inteligente, utilizando análise avançada para sugerir **o melhor usuário para cada tarefa**.
        </p>
      </header>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Como funciona?</h2>
        <p style={styles.cardText}>
          O <strong>Match Agile</strong> analisa as habilidades dos usuários e as associa às tarefas dos projetos, gerando recomendações baseadas em dados e IA.
        </p>
        <ul style={styles.cardList}>
          <li>📌 **Usuários** cadastram suas habilidades.</li>
          <li>✅ **Projetos** são criados e recebem tarefas.</li>
          <li>🤖 **IA** analisa e sugere a melhor alocação.</li>
          <li>📊 **Relatório - Match Agile** detalhado é gerado para otimização.</li>
        </ul>
      </div>

      <nav style={styles.nav}>
        <Link to="/users" style={styles.link}>👤 Usuários</Link>
        <Link to="/tasks" style={styles.link}>📋 Tarefas</Link>
        <Link to="/projects" style={styles.link}>🚀 Projetos</Link>
        <Link to="/match_agile" style={styles.matchLink}>⚡Match Agile</Link>
      </nav>
    </div>
  );
};

// Estilos CSS-in-JS
const styles = {
  container: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#f4f4f9',
    minHeight: '100vh',
  },
  header: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  heading: {
    color: '#333',
    fontSize: '2.8rem',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#555',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '0 auto 30px',
    textAlign: 'left',
  },
  cardTitle: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '10px',
  },
  cardText: {
    fontSize: '1rem',
    color: '#444',
    marginBottom: '10px',
  },
  cardList: {
    paddingLeft: '20px',
    fontSize: '1rem',
    color: '#666',
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
    marginTop: '20px',
  },
  link: {
    color: '#007bff',
    fontSize: '1.2rem',
    textDecoration: 'none',
    padding: '12px 18px',
    borderRadius: '5px',
    backgroundColor: '#e2e6ea',
    transition: 'background-color 0.3s ease, transform 0.2s',
    fontWeight: 'bold',
  },
  matchLink: {
    color: 'white',
    backgroundColor: '#28a745',
    padding: '12px 20px',
    fontSize: '1.3rem',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background 0.3s ease, transform 0.2s',
  },
};

export default Home;
