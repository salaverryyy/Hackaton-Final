// src/components/ProfileIcon.tsx
import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface ProfileIconProps {
  onClick: () => void;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute top-2 right-5 cursor-pointer rounded-full p-2 bg-white/80 hover:bg-white shadow-lg transition-transform transform hover:scale-110 "
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '48px',
      border: '2px solid #FFFFFF',
    }}
  >
    <UserCircleIcon className="h-10 w-10 text-blue-600" />
  </div>
);

export default ProfileIcon;
