import React from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();

  const styles = {
    button: {
      padding: "10px",
      fontSize: "16px",
      backgroundColor: "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background 0.3s, transform 0.1s",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "15px"
    },
    buttonHover: {
      backgroundColor: "#495057",
      transform: "scale(1.05)"
    },
    icon: {
      width: "24px",
      height: "24px"
    }
  };

  return (
    <button
      onClick={() => navigate("/")}
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
      <Home style={styles.icon} />
    </button>
  );
};

export default BackButton;
