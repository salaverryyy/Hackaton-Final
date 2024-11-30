// DeleteConfirmModal.tsx

import React from 'react';

interface DeleteConfirmModalProps {
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96">
        <h2 className="text-xl font-semibold">¿Estás seguro de que deseas eliminar esta cuenta?</h2>
        <div className="flex justify-end mt-4">
          <button onClick={onCancel} className="text-gray-500 mr-4">Cancelar</button>
          <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;


  