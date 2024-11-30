// src/components/FriendsList.tsx
import { PlusIcon } from '@heroicons/react/24/outline';

interface FriendsListProps {
  friends: any[];
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddFriendClick: () => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ friends, searchTerm, onSearchChange, onAddFriendClick }) => (
  <div className="bg-gray-100 rounded-lg shadow-lg p-6 w-1/3">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">Amigos</h2>
      <button onClick={onAddFriendClick} className="text-blue-500">
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
    <input
      type="text"
      placeholder="Buscar amigos..."
      value={searchTerm}
      onChange={onSearchChange}
      className="w-full p-2 border border-gray-300 rounded mb-4"
    />
    <div className="space-y-2">
      {friends.map(friend => (
        <div key={friend.id} className="bg-white p-2 rounded shadow-sm">
          {friend.username}
        </div>
      ))}
    </div>
  </div>
);

export default FriendsList;
