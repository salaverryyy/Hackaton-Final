import React, { useState } from 'react';
import { searchUsersByUsername, sendAlbumInvitations } from '../api';

interface InviteUsersSectionProps {
  accessCode: string;
  onClose: () => void;
}

interface User {
  username: string;
  email: string;
}

const InviteUsersSection: React.FC<InviteUsersSectionProps> = ({ accessCode, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const handleSearch = async () => {
    try {
      const users = await searchUsersByUsername(searchQuery);
      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSelectUser = (user: User) => {
    if (!selectedUsers.find((u) => u.username === user.username)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSendInvitations = async () => {
    try {
      const usernames = selectedUsers.map((user) => user.username);
      await sendAlbumInvitations(accessCode, usernames);
      alert('Invitaciones enviadas exitosamente.');
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('Error al enviar invitaciones.');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Invitar Usuarios</h2>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border p-2 rounded-lg"
        />
        <button onClick={handleSearch} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">
          Buscar
        </button>
      </div>
      <ul className="mt-4">
        {searchResults.map((user) => (
          <li
            key={user.username}
            onClick={() => handleSelectUser(user)}
            className="cursor-pointer bg-gray-100 p-2 rounded-lg shadow-md hover:bg-gray-200 mb-2"
          >
            {user.username} ({user.email})
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <h3 className="font-semibold">Usuarios seleccionados:</h3>
        <ul className="mb-4">
          {selectedUsers.map((user) => (
            <li key={user.username} className="text-gray-800">
              {user.username}
            </li>
          ))}
        </ul>
        <button
          onClick={handleSendInvitations}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
        >
          Enviar Invitaciones
        </button>
      </div>
    </div>
  );
};

export default InviteUsersSection;
