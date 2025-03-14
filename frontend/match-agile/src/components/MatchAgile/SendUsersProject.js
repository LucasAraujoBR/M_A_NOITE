import React, { useState, useEffect } from "react";
import api from "../../services/api";
import BackButton from "../Common/BackButton";
import HomeButton from "../Common/HomeButton";

const ProjectUserSelect = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [sprintNumber, setSprintNumber] = useState("");
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
    if (!selectedProject || selectedUsers.length === 0 || !sprintNumber) {
      alert("Por favor, escolha um projeto, selecione pelo menos um usuário e informe o número da sprint.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        project_id: selectedProject,
        user_ids: selectedUsers,
        sprints: sprintNumber,
      };

      const response = await api.post("/projects/match-agile", payload);
      let pureString = typeof response.data === "string" ? response.data : response.data.message;

      pureString = pureString
        .replace(/([.!?])\s*/g, "$1\n")
        .replace(/\s{2,}/g, " ")
        .trim();

      const fileResponse = await api.post(
        "http://127.0.0.1:5001/generate_file",
        { text: pureString, file_type: "pdf" },
        { responseType: "blob" }
      );

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
      <HomeButton />
      <br></br>
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

      <div style={styles.inputContainer}>
        <label htmlFor="sprint-number" style={styles.label}>Total de Sprints:</label>
        <input
          type="number"
          id="sprint-number"
          value={sprintNumber}
          onChange={(e) => setSprintNumber(e.target.value)}
          style={styles.input}
        />
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
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  selectContainer: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
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
  inputContainer: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "border-color 0.3s",
  },
  subHeading: {
    marginBottom: "10px",
  },
  userList: {
    listStyle: "none",
    padding: "0",
  },
  userItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  checkbox: {
    marginRight: "10px",
  },
  userName: {
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default ProjectUserSelect;
