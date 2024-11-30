// src/components/EditProfileModal.tsx

import React, { useState } from 'react';

interface EditProfileModalProps {
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  };
  onClose: () => void;
  onSave: (updatedData: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ userData, onClose, onSave }) => {
  const [localData, setLocalData] = useState(userData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalData({
      ...localData,
      [name]: value,
    });
  };

  const handleSave = () => {
    onSave(localData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Editar Perfil</h2>
          <button onClick={onClose} className="text-gray-500">X</button>
        </div>
        <input
          type="text"
          name="firstName"
          value={localData.firstName}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full mt-4 p-2 border rounded"
        />
        <input
          type="text"
          name="lastName"
          value={localData.lastName}
          onChange={handleChange}
          placeholder="Apellido"
          className="w-full mt-2 p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={localData.email}
          onChange={handleChange}
          placeholder="Correo"
          className="w-full mt-2 p-2 border rounded"
        />
        <input
          type="text"
          name="username"
          value={localData.username}
          onChange={handleChange}
          placeholder="Nombre de usuario"
          className="w-full mt-2 p-2 border rounded"
        />
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white w-full py-2 mt-4 rounded"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default EditProfileModal;





  