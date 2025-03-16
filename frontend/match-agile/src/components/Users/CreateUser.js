import React, { useState } from 'react';
import api from '../../services/api';
import BackButton from "../Common/BackButton";
import HomeButton from "../Common/HomeButton";

const CreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [personalities, setPersonalities] = useState([]);
  const [level, setLevel] = useState('');
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Para mostrar carregamento
  const [successMessage, setSuccessMessage] = useState(''); // Mensagem de sucesso
  const [errorMessage, setErrorMessage] = useState(''); // Mensagem de erro

  const allowedAreas = [
    { name: 'Backend', emoji: '💻' },
    { name: 'Frontend', emoji: '🎨' },
    { name: 'IA', emoji: '🤖' },
    { name: 'Design', emoji: '🖌️' },
    { name: 'QA', emoji: '🔍' },
  ];

  const allowedLevels = ['Júnior', 'Pleno', 'Sênior'];

  // 24 personalidades com emojis
  const allowedPersonalities = [
    'Visionário 🚀', 'Analítico 🧠', 'Criativo 🎨', 'Pragmático 🔧', 'Líder 👑', 'Empático ❤️', 
    'Detalhista 🔍', 'Proativo ⚡', 'Comunicativo 🗣️', 'Organizado 📅', 'Responsável ✅', 
    'Entusiástico 💥', 'Flexible 🤸', 'Focado 🎯', 'Decisivo 💡', 'Inovador 💡', 
    'Motivado 🔥', 'Confiável 🛡️', 'Sociável 🤝', 'Assertivo 💪', 'Colaborativo 👥', 
    'Autônomo 🌱', 'Perseverante 💪', 'Intuitivo 🔮', 'Desafiador 🏆'
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Inicia o carregamento

    const data = { name, email, personality: personalities, level, areas };

    try {
      const response = await api.post('/users', data);

      if (response.status === 201) {
        setSuccessMessage('Usuário criado com sucesso!'); // Mensagem de sucesso
        setTimeout(() => {
          // Limpar os campos do formulário após o sucesso
          setName('');
          setEmail('');
          setPersonalities([]);
          setLevel('');
          setAreas([]);
        }, 1500); // Exibe a mensagem por 1.5 segundos antes de limpar os campos
      }
    } catch (error) {
      setErrorMessage('Erro ao criar usuário. Tente novamente mais tarde.'); // Mensagem de erro
      console.error('Erro ao criar usuário', error);
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  const handleAreaChange = (event) => {
    const { value, checked } = event.target;
    setAreas(prevAreas =>
      checked ? [...prevAreas, value] : prevAreas.filter(area => area !== value)
    );
  };

  const handlePersonalityChange = (event) => {
    const { value, checked } = event.target;
    setPersonalities(prevPersonalities =>
      checked ? [...prevPersonalities, value] : prevPersonalities.filter(personality => personality !== value)
    );
  };

  return (
    <div style={styles.container}>
      <HomeButton />
      <br></br>
      <BackButton />
      <div style={styles.card}>
        <h2 style={styles.heading}>Criar Usuário</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {successMessage && (
            <div style={styles.successMessage}>{successMessage}</div>
          )}
          {errorMessage && (
            <div style={styles.errorMessage}>{errorMessage}</div>
          )}
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label>Personalidades (Selecione uma ou mais):</label>
            <div style={styles.checkboxGrid}>
              {allowedPersonalities.map((personality, index) => (
                <label key={index} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={personality}
                    checked={personalities.includes(personality)}
                    onChange={handlePersonalityChange}
                    style={styles.checkbox}
                  />
                  {personality}
                </label>
              ))}
            </div>
          </div>
          <div style={styles.inputGroup}>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
              style={styles.input}
            >
              <option value="" disabled>Selecione o Nível</option>
              {allowedLevels.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label>Áreas (Selecione uma ou mais):</label>
            <div style={styles.checkboxGrid}>
              {allowedAreas.map((area) => (
                <label key={area.name} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={area.name}
                    checked={areas.includes(area.name)}
                    onChange={handleAreaChange}
                    style={styles.checkbox}
                  />
                  {area.emoji} {area.name}
                </label>
              ))}
            </div>
          </div>
          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.button} disabled={isLoading}>
              {isLoading ? 'Carregando...' : 'Criar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
    maxWidth: '800px',
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
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',  // Grid de 3 colunas
    gap: '15px',
    width: '100%',
    marginTop: '10px',
    marginBottom: '20px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    justifyContent: 'center',
    padding: '5px 10px',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    transition: 'background-color 0.3s ease',
  },
  checkbox: {
    marginRight: '8px',
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
  successMessage: {
    color: 'green',
    fontSize: '1.1rem',
    marginBottom: '15px',
  },
  errorMessage: {
    color: 'red',
    fontSize: '1.1rem',
    marginBottom: '15px',
  },
};

export default CreateUser;
