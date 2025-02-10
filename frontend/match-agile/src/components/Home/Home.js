import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bem-vindo ao Match Agile</h1>
      <ul>
        <li><Link to="/users">Usuários</Link></li>
        <li><Link to="/tasks">Tarefas</Link></li>
        <li><Link to="/projects">Projetos</Link></li>
      </ul>
    </div>
  );
};

export default Home;
