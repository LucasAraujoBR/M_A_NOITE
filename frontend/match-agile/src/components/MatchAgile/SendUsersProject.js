import React, { useState, useEffect } from "react";
import api from "../../services/api";
import BackButton from "../Common/BackButton";

const ProjectUserSelect = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      try {
        const [projectsResponse, usersResponse] = await Promise.all([
          api.get("/projects"),
          api.get("/users"),
        ]);
        setProjects(projectsResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Erro ao carregar projetos ou usuários", error);
      }
    };
    fetchProjectsAndUsers();
  }, []);

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedProject || selectedUsers.length === 0) {
      alert("Por favor, escolha um projeto e selecione pelo menos um usuário.");
      return;
    }
  
    setLoading(true);
  
    try {
      const payload = {
        project_id: selectedProject,
        user_ids: selectedUsers,
      };
  
      // 1. Pega a string pura da rota /projects/match-agile
      const response = await api.post("/projects/match-agile", payload);
      let pureString = typeof response.data === "string" ? response.data : response.data.message;
  
      // 2. Normaliza o texto para melhor formatação
      pureString = pureString
        .replace(/([.!?])\s*/g, "$1\n") // quebra linha após pontuações finais
        .replace(/\s{2,}/g, " ") // remove espaços duplicados
        .trim(); // remove espaços no início e fim
  
      // 3. Envia o texto normalizado para /generate_file
      const fileResponse = await api.post(
        "http://localhost:5000/generate_file",
        { text: pureString, file_type: "pdf" },
        { responseType: "blob" }
      );
  
      // 4. Faz o download automático do PDF
      const url = window.URL.createObjectURL(new Blob([fileResponse.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "relatorio.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
  
    } catch (error) {
      console.error("Erro ao gerar o relatório", error);
      alert("Ocorreu um erro ao gerar o relatório.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div style={styles.container}>
      <BackButton />
      <h2 style={styles.heading}>Selecionar Usuários para o Projeto</h2>

      <div style={styles.selectContainer}>
        <label htmlFor="project-select" style={styles.label}>
          Escolha um Projeto:
        </label>
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
            <span style={styles.userName}>
              {user.name} ({user.email})
            </span>
          </li>
        ))}
      </ul>

      <button onClick={handleSubmit} disabled={loading} style={styles.button}>
        {loading ? "Gerando PDF..." : "Gerar relatório em PDF"}
      </button>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    padding: "30px",
    borderRadius: "8px",
    maxWidth: "800px",
    margin: "50px auto",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    fontSize: "2rem",
    marginBottom: "20px",
  },
  subHeading: {
    color: "#555",
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  selectContainer: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#444",
    fontSize: "1rem",
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "border-color 0.3s",
  },
  userList: {
    listStyle: "none",
    padding: "0",
    margin: "0",
    maxHeight: "200px",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  userItem: {
    display: "flex",
    alignItems: "center",
    padding: "8px",
    borderBottom: "1px solid #eee",
  },
  checkbox: {
    marginRight: "10px",
  },
  userName: {
    fontSize: "1rem",
    color: "#555",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default ProjectUserSelect;
