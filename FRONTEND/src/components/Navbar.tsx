import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PhotoIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import ProfileIcon from '../components/ProfileIcon';
import { logoutUser } from '../api'; // Importa la función de logout
const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser(); // Llama al endpoint de logout
      localStorage.clear(); // Limpia el token y cualquier dato del usuario
      navigate('/login'); // Redirige al usuario a la página de login
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="bg-white/20 backdrop-blur-md text-gray-800 h-16 shadow-md fixed top-0 left-0 w-full z-50 flex items-center">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate('/homePage')}
        >
          Eventify
        </h1>

        {/* Buttons */}
        <div className="flex space-x-4 items-center">
          <button
            onClick={() => navigate('/create-event')}
            className="flex items-center space-x-2 bg-gray-200/70 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 hover:text-black transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Nuevo Evento</span>
          </button>
          <button
            onClick={() => navigate('/events')}
            className="flex items-center space-x-2 bg-gray-200/70 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 hover:text-black transition-all"
          >
            <PhotoIcon className="w-5 h-5" />
            <span>Eventos</span>
          </button>

          {/* Profile Icon */}
          <ProfileIcon onClick={() => navigate('/profile')} />

          {/* Logout Icon */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
