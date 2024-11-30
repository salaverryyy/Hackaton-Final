import React, { useState } from 'react';

interface MemoryFormProps {
  formData: {
    memoryName: string;
    description: string;
    coverPhoto: File | null;
  };
  onFormDataChange: (formData: MemoryFormProps['formData']) => void;
  onRemoveCoverPhoto: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const MemoryForm: React.FC<MemoryFormProps> = ({
  formData,
  onFormDataChange,
  onRemoveCoverPhoto,
  onSubmit,
}) => {
  const [fileError, setFileError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormDataChange({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    // Validar si el archivo es una imagen
    if (file && !file.type.startsWith('image/')) {
      setFileError('Por favor, selecciona un archivo de imagen válido.');
      return;
    }

    setFileError(null);
    onFormDataChange({ ...formData, coverPhoto: file });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700" htmlFor="memoryName">
          Nombre del Memory
        </label>
        <input
          id="memoryName"
          type="text"
          name="memoryName"
          placeholder="Ejemplo: Vacaciones de verano"
          value={formData.memoryName}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
          aria-label="Nombre del Memory"
        />
      </div>
      <div>
        <label className="block text-gray-700" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe tu memory aquí"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
          aria-label="Descripción del Memory"
        />
      </div>
      <div>
        <label className="block text-gray-700" htmlFor="coverPhoto">
          Foto de Portada
        </label>
        <input
          id="coverPhoto"
          type="file"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border rounded"
          accept="image/*"
          aria-label="Seleccionar imagen para la portada"
        />
        {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
        {formData.coverPhoto && (
          <div className="mt-2 flex items-center gap-4">
            <p className="text-gray-600">{formData.coverPhoto.name}</p>
            <button
              type="button"
              onClick={onRemoveCoverPhoto}
              className="text-red-500 text-sm underline hover:text-red-700"
            >
              Quitar imagen
            </button>
          </div>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        aria-label="Crear Memory"
      >
        Crear Memory
      </button>
    </form>
  );
};

export default MemoryForm;
