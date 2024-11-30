// src/components/UserInfo.tsx
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface UserInfoProps {
  userData: {
    username: string;
    firstName: string;
    lastName: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ userData, onEdit, onDelete }) => (
  <div className="bg-gray-100 rounded-lg shadow-lg p-6 w-1/3">
    <motion.div whileHover={{ scale: 1.05 }}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{userData.username}</h2>
        <PencilIcon onClick={onEdit} className="h-6 w-6 text-blue-500 cursor-pointer" />
      </div>
      <p className="text-gray-500">{`${userData.firstName} ${userData.lastName}`}</p>
      <TrashIcon onClick={onDelete} className="h-6 w-6 text-red-500 mt-2 cursor-pointer" />
    </motion.div>
  </div>
);

export default UserInfo;
