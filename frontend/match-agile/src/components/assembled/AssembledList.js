import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import BackButton from "../Common/BackButton";
import HomeButton from "../Common/HomeButton";

const AssembledList = () => {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [sprints, setSprints] = useState("");
    const [selectedUsers, setSelectedUsers] = useState({});  // Alteração aqui
    const [selectedTasks, setSelectedTasks] = useState({});  // Alteração aqui
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsRes, usersRes, tasksRes] = await Promise.all([
                    api.get("/projects/projects_list"),
                    api.get("/users"),
                    api.get("/tasks"),
                ]);
                setProjects(projectsRes.data || []);
                setUsers(usersRes.data || []);
                setTasks(tasksRes.data || []);
            } catch (error) {
                console.error("Erro ao buscar dados", error);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/projects/${id}`);
            setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
        } catch (error) {
            console.error("Erro ao excluir projeto", error);
        }
    };

    const handleAddUser = async (projectId) => {
        const userId = selectedUsers[projectId];
        if (!userId) return;
        try {
            await api.post(`/projects/${projectId}/add-user`, { user_id: userId });
            alert("Usuário adicionado com sucesso!");
            setSelectedUsers(prev => ({ ...prev, [projectId]: null }));
        } catch (error) {
            if (error.response && error.response.status === 500) {
                alert("Este usuário já tinha sido adicionado ao projeto.");
            } else {
                console.error("Erro ao adicionar usuário", error);
                alert("Ocorreu um erro ao adicionar o usuário. Tente novamente.");
            }
        }
    };

    const handleAddTask = async (projectId) => {
        const taskId = selectedTasks[projectId];
        if (!taskId) return;
        try {
            await api.post(`/projects/${projectId}/add-task`, { task_id: taskId });
            alert("Tarefa adicionada com sucesso!");
            setSelectedTasks(prev => ({ ...prev, [projectId]: null }));
        } catch (error) {
            if (error.response && error.response.status === 500) {
                alert("Esta tarefa já tinha sido adicionada ao projeto.");
            } else {
                console.error("Erro ao adicionar tarefa", error);
                alert("Ocorreu um erro ao adicionar a tarefa. Tente novamente.");
            }
        }
    };

    const handleReMatchAgile = async (projectId) => {
        setLoading(true);

        try {
            const usersResponse = await api.get(`/projects/${projectId}/users`);
            const usersIds = usersResponse.data.users_ids || [];

            const userIds = usersIds.map(user => user.id);

            const payload = {
                project_id: projectId,
                user_ids: userIds,
                sprints: sprints,
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
            console.error("Erro ao gerar o relatório", error.response || error.message || error);
            alert("Ocorreu um erro ao gerar o relatório.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div className="button-container">
                <HomeButton />
                <br></br>
                <BackButton />
            </div>
            <h2 style={styles.title}>Projetos</h2>
            <Link to="/projects/create" style={styles.createButton}>
                Criar Novo Projeto
            </Link>
            <ul style={styles.projectsList}>
                {projects.map((project) => (
                    <li key={project.id} style={styles.projectItem}>
                        <div style={styles.projectHeader}>
                            <div>
                                <span style={styles.projectName}>{project.name}</span>
                                <span style={styles.projectDescription}> ({project.description})</span>
                            </div>
                            <button style={styles.deleteButton} onClick={() => handleDelete(project.id)}>
                                Deletar Projeto
                            </button>
                        </div>
                        <div style={styles.section}>
                            <strong style={styles.sectionTitle}>Usuários:</strong>
                            <ul style={styles.userList}>
                                {Array.isArray(project.users) && project.users.map((user) => (
                                    <li key={user.id} style={styles.userItem}>
                                        {user.name} ({user.email})
                                    </li>
                                ))}
                            </ul>
                            <div style={styles.actionSection}>
                                <select
                                    onChange={(e) => setSelectedUsers(prev => ({ ...prev, [project.id]: e.target.value }))}
                                    value={selectedUsers[project.id] || ""}
                                    style={styles.userSelect}
                                >
                                    <option value="">Adicionar usuário</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                                <button style={styles.addButton} onClick={() => handleAddUser(project.id)}>
                                    Adicionar
                                </button>
                            </div>
                        </div>
                        <div style={styles.section}>
                            <strong style={styles.sectionTitle}>Tarefas:</strong>
                            <ul style={styles.taskList}>
                                {Array.isArray(project.tasks) && project.tasks.map((task) => (
                                    <li key={task.id} style={styles.taskItem}>
                                        {task.title} - {task.category}
                                    </li>
                                ))}
                            </ul>
                            <div style={styles.actionSection}>
                                <select
                                    onChange={(e) => setSelectedTasks(prev => ({ ...prev, [project.id]: e.target.value }))}
                                    value={selectedTasks[project.id] || ""}
                                    style={styles.taskSelect}
                                >
                                    <option value="">Adicionar tarefa</option>
                                    {tasks.map((task) => (
                                        <option key={task.id} value={task.id}>{task.title}</option>
                                    ))}
                                </select>
                                <button style={styles.addButton} onClick={() => handleAddTask(project.id)}>
                                    Adicionar
                                </button>
                            </div>
                        </div>
                        <div style={styles.section}>
                            <strong style={styles.sectionTitle}>Sprints:</strong>
                            <div style={styles.actionSection}>
                                <input
                                    type="number"
                                    min="1"
                                    value={sprints}
                                    onChange={(e) => setSprints(e.target.value)}
                                    style={styles.sprintInput}
                                />
                            </div>
                        </div>
                        <div style={styles.projectActions}>
                            <Link to={`/projects/edit/${project.id}`} style={styles.editButton}>
                                Editar Projeto
                            </Link>
                            <Link to="#" onClick={() => handleReMatchAgile(project.id)} style={styles.matchButton}>
                                Re-Match Agile
                            </Link>
                            <Link
                                to={`/projects/details/${project.id}`}
                                style={styles.viewButton}
                            >
                                Ver Usuários e Tarefas
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Estilos permanecem os mesmos


const styles = {
    container: {
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
    },
    title: {
        fontSize: "24px",
        marginBottom: "20px",
    },
    createButton: {
        backgroundColor: "#007bff",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        textDecoration: "none",
        marginBottom: "20px",
    },
    projectsList: {
        listStyle: "none",
        padding: 0,
    },
    projectItem: {
        backgroundColor: "#fff",
        marginBottom: "20px",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    projectHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    projectName: {
        fontSize: "18px",
        fontWeight: "bold",
    },
    projectDescription: {
        fontSize: "14px",
        color: "#888",
    },
    deleteButton: {
        backgroundColor: "#ff4d4d",
        color: "#fff",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
        borderRadius: "5px"
    },
    section: {
        marginTop: "15px",
    },
    sectionTitle: {
        fontSize: "16px",
        fontWeight: "bold",
    },
    userList: {
        listStyle: "none",
        paddingLeft: "0",
    },
    userItem: {
        fontSize: "14px",
    },
    actionSection: {
        display: "flex",
        alignItems: "center",
    },
    userSelect: {
        padding: "5px 10px",
        marginRight: "10px",
    },
    addButton: {
        padding: "5px 15px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
    },
    taskList: {
        listStyle: "none",
        paddingLeft: "0",
    },
    taskItem: {
        fontSize: "14px",
    },
    taskSelect: {
        padding: "5px 10px",
        marginRight: "10px",
    },
    sprintInput: {
        padding: "5px 10px",
        width: "80px",
    },
    projectActions: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "15px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",  // Adicionando espaçamento entre os botões
        marginBottom: "20px",
    },
    button: {
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        border: "none",
        textDecoration: "none",
        transition: "background-color 0.3s ease, transform 0.2s ease",
    },
    homeButton: {
        backgroundColor: "#007bff",
        color: "#fff",
    },
    backButton: {
        backgroundColor: "#28a745",
        color: "#fff",
    },
    buttonHover: {
        transform: "scale(1.05)",
    },
    buttonFocus: {
        outline: "none",
    },
    editButton: {
        backgroundColor: "#ffc107",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        textDecoration: "none",
    },
    matchButton: {
        backgroundColor: "#007bff",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        textDecoration: "none",
    },
    viewButton: {
        backgroundColor: "#17a2b8",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        textDecoration: "none"
    },
    modal: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        width: "60%",
        maxHeight: "80%",
        overflowY: "auto",
    },
    closeButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        fontSize: "20px",
        cursor: "pointer",
    },
    closeModalBtn: {
        backgroundColor: "#007bff",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
    },
    loading: {
        fontSize: "18px",
        color: "#007bff",
    }
};


export default AssembledList;
