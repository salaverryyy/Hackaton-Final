import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createMemory, associateMemoryWithEvent } from '../api';
import MemoryForm from '../components/MemoryForm';

const CreateMemoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = location.state || {};

  const [formData, setFormData] = useState({
    memoryName: '',
    description: '',
    coverPhoto: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Actualizar el estado del formulario
  const handleFormDataChange = (newFormData: typeof formData) => {
    setFormData(newFormData);
  };

  // Quitar la foto de portada seleccionada
  const handleRemoveCoverPhoto = () => {
    setFormData((prev) => ({ ...prev, coverPhoto: null }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const memoryData = new FormData();
    memoryData.append('memoryName', formData.memoryName);
    memoryData.append('description', formData.description);
    if (formData.coverPhoto) {
      memoryData.append('coverPhoto', formData.coverPhoto);
    }

    try {
      const memoryResponse = await createMemory(memoryData);
      const memoryId = memoryResponse.id;

      if (eventId && memoryId) {
        await associateMemoryWithEvent(eventId, memoryId);
      }

      navigate('/homePage');
    } catch (err) {
      console.error('Error creating memory:', err);
      setError('Hubo un error al crear el memory. Por favor, revisa los datos e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Crear Memory</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <MemoryForm
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onRemoveCoverPhoto={handleRemoveCoverPhoto}
          onSubmit={handleSubmit}
        />
        {loading && (
          <p className="text-center text-blue-600 mt-4">Creando memory, por favor espera...</p>
        )}
      </div>
    </div>
  );
};

export default CreateMemoryPage;


