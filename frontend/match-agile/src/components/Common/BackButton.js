import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  // Estilos CSS-in-JS
  const styles = {
    button: {
      padding: "10px 20px",
      fontSize: "16px",
      backgroundColor: "#6c757d", // Cinza padrão
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background 0.3s, transform 0.1s",
      display: "inline-block",
      marginBottom: "15px"
    },
    buttonHover: {
      backgroundColor: "#495057", // Cinza mais escuro
      transform: "scale(1.05)"
    }
  };

  return (
    <button
      onClick={() => navigate(-1)}
      style={styles.button}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
        e.target.style.transform = styles.buttonHover.transform;
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = styles.button.backgroundColor;
        e.target.style.transform = "scale(1)";
      }}
    >
      ← Voltar
    </button>
  );
};

export default BackButton;
