import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchUserData,
  fetchProfilePic,
  updateUserProfile,
  deleteUser,
  deleteProfilePic,
  getUserIdFromToken,
  updateProfilePic,
} from '../api';
import UserInfo from '../components/UserInfo';
import ProfilePicture from '../components/ProfilePicture';
import EditProfileModal from '../components/EditProfileModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const userId = getUserIdFromToken(); // Obtener el userId directamente del token
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false);

  // Cargar datos del usuario y foto de perfil
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (userId) {
          const data = await fetchUserData();
          setUserData(data);

          const profilePic = await fetchProfilePic();
          setProfilePicUrl(profilePic || null);
        } else {
          console.error('No se pudo obtener el userId del token.');
          navigate('/login'); // Redirige al login si no hay userId
        }
      } catch (error) {
        console.error('Error fetching user data or profile picture:', error);
      }
    };

    loadUserData();
  }, [userId, navigate]);

  // Guardar cambios en el perfil
  const handleSaveProfileChanges = async (updatedData: typeof userData) => {
    try {
      await updateUserProfile(updatedData);
      setUserData(updatedData);
      setIsEditProfileOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async () => {
    try {
      await deleteUser();
      localStorage.clear(); // Limpiar almacenamiento local
      navigate('/login');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Eliminar foto de perfil
  const handleDeleteProfilePic = async () => {
    try {
      await deleteProfilePic();
      setProfilePicUrl(null); // Actualizar la vista
    } catch (error) {
      console.error('Error deleting profile picture:', error);
    }
  };

  const handleUpdateProfilePic = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('profilePic', file);
  
      const newProfilePicUrl = await updateProfilePic(formData);
      setProfilePicUrl(newProfilePicUrl); // Actualizar la URL de la foto de perfil
      setIsEditingProfilePic(false);
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };
  
  return (
    <div className="p-20">
      <ProfilePicture
      profilePicUrl={profilePicUrl}
      onDeletePhoto={handleDeleteProfilePic}
      isEditPhoto={isEditingProfilePic}
      onEdit={() => setIsEditingProfilePic(true)}
      onSave={handleUpdateProfilePic} // Ahora coincide con el tipo esperado
      onCancelEdit={() => setIsEditingProfilePic(false)}
      />

      <UserInfo
      userData={userData}
      onEdit={() => setIsEditProfileOpen(true)}
      onDelete={() => setIsDeleteConfirmOpen(true)}
      />

      {isEditProfileOpen && (
      <EditProfileModal
        userData={userData}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleSaveProfileChanges}
      />
      )}

      {isDeleteConfirmOpen && (
      <DeleteConfirmModal
        onConfirm={handleDeleteUser}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
      )}
    </div>
  );
};

export default ProfilePage;

