import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import BackButton from "../Common/BackButton";
import HomeButton from "../Common/HomeButton";

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    personality: '',
    level: '',
    areas: []
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuário', error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleCheckboxChange = (area) => {
    setUser((prevUser) => {
      const areas = prevUser.areas.includes(area)
        ? prevUser.areas.filter((a) => a !== area)
        : [...prevUser.areas, area];
      return { ...prevUser, areas };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/users/${userId}`, user);
      setSuccessMessage('Usuário atualizado com sucesso!');
      setTimeout(() => navigate('/users'), 1500);
    } catch (error) {
      setErrorMessage('Erro ao atualizar usuário. Tente novamente.');
      console.error('Erro ao atualizar usuário', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <div style={styles.container}>
      <HomeButton />
      <br></br>
      <BackButton />
      <div style={styles.card}>
        <h2 style={styles.heading}>Editar Usuário</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
          {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}

          <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} style={styles.input} required placeholder="Nome" />
          <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} style={styles.input} required placeholder="Email" />
          <input type="text" value={user.personality} onChange={(e) => setUser({ ...user, personality: e.target.value })} style={styles.input} placeholder="Personalidade (separada por vírgulas)" />
          
          <select value={user.level} onChange={(e) => setUser({ ...user, level: e.target.value })} style={styles.input} required>
            <option value="">Selecione o Nível</option>
            <option value="Júnior">Júnior</option>
            <option value="Pleno">Pleno</option>
            <option value="Sênior">Sênior</option>
          </select>
          
          <div style={styles.checkboxGroup}>
            <label>Áreas (Selecione uma ou mais):</label>
            {['Backend', 'Frontend', 'IA', 'Design', 'QA'].map((area) => (
              <label key={area} style={styles.checkboxLabel}>
                <input type="checkbox" checked={user.areas.includes(area)} onChange={() => handleCheckboxChange(area)} /> {area}
              </label>
            ))}
          </div>

          <button type="submit" style={styles.button} disabled={isLoading}>{isLoading ? 'Carregando...' : 'Atualizar Usuário'}</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px' },
  card: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '500px', textAlign: 'center' },
  heading: { color: '#343a40', fontSize: '1.8rem', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' },
  input: { padding: '12px', fontSize: '1rem', border: '1px solid #ced4da', borderRadius: '8px', width: '100%' },
  checkboxGroup: { textAlign: 'left', width: '100%', marginTop: '10px' },
  checkboxLabel: { display: 'block', marginTop: '5px' },
  button: { backgroundColor: '#007bff', color: '#fff', fontSize: '1.1rem', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '50%', transition: 'background 0.3s' },
  successMessage: { color: 'green', fontSize: '1.1rem', marginBottom: '15px' },
  errorMessage: { color: 'red', fontSize: '1.1rem', marginBottom: '15px' }
};

export default EditUser;
