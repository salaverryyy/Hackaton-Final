// src/pages/NotFoundPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCompass } from 'react-icons/fi'; // Icono de brújula perdido
import '../styles/NotFoundPage.css'; // Estilo personalizado para la página

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/homePage');
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <FiCompass className="not-found-icon" />
        <h1 className="not-found-title">404 - Página no encontrada</h1>
        <p className="not-found-message">
          Parece que te has perdido. No te preocupes, sucede incluso a los mejores exploradores.
        </p>
        <button onClick={handleGoHome} className="not-found-button">
          Regresar al inicio
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
