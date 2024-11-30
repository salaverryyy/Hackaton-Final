// src/components/ProfilePicture.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface ProfilePictureProps {
  profilePicUrl: string | null;
  onDeletePhoto: () => void;
  isEditPhoto: boolean;
  onEdit: () => void;
  onSave: (file: File) => void; // Cambiar el tipo aquí para aceptar un archivo
  onCancelEdit: () => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  profilePicUrl,
  isEditPhoto,
  onEdit,
  onSave,
  onDeletePhoto,
  onCancelEdit,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveClick = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      console.log(formData)
      try {
        const response = await axios.post('http://54.146.73.88:8080/media/profile-pic', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        onSave(response.data); // Llama a onSave con la URL de la imagen subida
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        <img
          src={profilePicUrl || "/default-profile-pic.jpg"} // Ruta a la imagen por defecto en la carpeta public
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        {isEditPhoto && (
          <button
            onClick={onCancelEdit}
            className="absolute top-0 right-0 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
          >
            X
          </button>
        )}
      </div>
      {isEditPhoto ? (
        <div className="mt-4">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleSaveClick} className="bg-blue-500 text-white mt-2 px-4 py-2 rounded">
            Guardar Foto
          </button>
        </div>
      ) : (
        <button onClick={onEdit} className="bg-blue-500 text-white mt-4 px-4 py-2 rounded">
          Editar foto de perfil
        </button>
      )}
      {isEditPhoto && (
        <button
          onClick={onDeletePhoto}
          className="text-red-500 text-sm mt-2"
        >
          Eliminar foto de perfil
        </button>
      )}
    </div>
  );
};

export default ProfilePicture;






