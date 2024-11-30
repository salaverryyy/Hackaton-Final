// src/components/AddFriendModal.tsx
interface AddFriendModalProps {
    newFriendUsername: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddFriend: () => void;
    onClose: () => void;
  }
  
  const AddFriendModal: React.FC<AddFriendModalProps> = ({ newFriendUsername, onChange, onAddFriend, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h3 className="text-xl font-semibold mb-4">Añadir Amigo</h3>
        <input
          type="text"
          placeholder="Username del amigo"
          value={newFriendUsername}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button onClick={onAddFriend} className="bg-blue-500 text-white w-full py-2 rounded">Agregar</button>
        <button onClick={onClose} className="w-full mt-2 text-gray-500">Cancelar</button>
      </div>
    </div>
  );
  
  export default AddFriendModal;
  