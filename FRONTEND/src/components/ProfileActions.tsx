// src/components/ProfileActions.tsx
import React from 'react';

interface ProfileActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ onEdit, onDelete, onBack }) => {
  return (
    <div className="flex justify-between items-center">
      <button onClick={onBack} className="text-blue-500 text-xl">&#8592; Volver</button>
      <div>
        <button onClick={onEdit} className="text-blue-500 text-xl mr-4">Editar</button>
        <button onClick={onDelete} className="text-red-500 text-xl">Eliminar cuenta</button>
      </div>
    </div>
  );
};

export default ProfileActions;
