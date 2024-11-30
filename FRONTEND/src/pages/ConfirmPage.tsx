// src/pages/ConfirmPage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ConfirmPage: React.FC = () => {
  const { invitationUUID } = useParams<{ invitationUUID: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAcceptInvitation = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://54.146.73.88:8080/invitation/confirm/${invitationUUID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const albumLink = response.data.albumLink;
      navigate(`/album/${albumLink.split('/').pop()}`);
    } catch (err) {
      setError('Hubo un problema al confirmar la invitación.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Confirmando invitación...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Aceptar Invitación</h1>
      <p>Haz clic en el botón para aceptar la invitación y acceder al álbum.</p>
      <button
        onClick={handleAcceptInvitation}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Aceptar Invitación
      </button>
    </div>
  );
};

export default ConfirmPage;
