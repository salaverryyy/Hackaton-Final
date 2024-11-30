// src/pages/AlbumPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion } from "framer-motion";
import { ClipboardIcon, CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  createPublication,
} from '../api'; // Adjust the path
import { AuroraBackground } from "../components/ui/aurora-background";
interface Album {
  id: number;
  memoryName: string;
  description: string;
  memoryCreationDate: string;
  albumLink: string;
  accessCode: string;
  coverPhoto: string;
}

interface User {
  username: string;
  email: string;
}

const AlbumPage: React.FC = () => {
  const { memoryId } = useParams<{ memoryId?: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showInviteSection, setShowInviteSection] = useState(false);
  const [showPublicationForm, setShowPublicationForm] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!memoryId) {
        console.error('Memory ID is undefined.');
        return;
      }

      try {
        const isUUID = memoryId.includes('-');
        if (isUUID) {
          const response = await axios.get(`http://54.146.73.88:8080/memories/uuid/${memoryId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setAlbum(response.data);
        } else {
          const uuidResponse = await axios.get(`http://54.146.73.88:8080/memories/${memoryId}/album-uuid`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const albumUUID = uuidResponse.data;
          window.location.replace(`/album/${albumUUID}`);
        }
      } catch (error) {
        console.error('Error fetching album UUID or album details:', error);
      }
    };

    fetchAlbum();
  }, [memoryId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copiado al portapapeles.');
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://54.146.73.88:8080/usuarios/search?username=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSelectUser = (user: User) => {
    if (!selectedUsers.find((u) => u.username === user.username)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };
  const handleCreatePublication = async () => {
    if (!album || !file) {
      alert('Por favor completa todos los campos.');
      return;
    }

    try {
      await createPublication(description, file);
      alert('Publicación creada exitosamente.');
      setShowPublicationForm(false);
      setDescription('');
      setFile(null);
    } catch (error) {
      console.error('Error creating publication:', error);
      alert('Error al crear la publicación.');
    }
  };
  const handleSendInvitations = async () => {
    if (!album) return;

    const usernames = selectedUsers.map((user) => user.username);
    try {
      await axios.post(
        'http://54.146.73.88:8080/invitation/sendByQr',
        {
          accessCode: album.accessCode,
          usernames,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Invitaciones enviadas exitosamente.');
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('Error al enviar invitaciones.');
    }
  };

  if (!album) {
    return <p className="text-center text-white text-lg mt-20">Cargando álbum...</p>;
  }
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >

      {/* Album Details */}
      <div className="container mx-auto max-w-4xl bg-white text-gray-800 rounded-lg shadow-lg p-8 mt-8">
 
        {/* Album Metadata */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div className="flex-1 mb-6 md:mb-0">
            <h1 className="text-4xl font-bold mb-2">{album.memoryName}</h1>
            <p className="text-gray-700">{album.description}</p>
            <p>
        ACCESCODE: {album.accessCode}
        </p>
            <p className="text-gray-500 mt-2">
              Fecha de creación: {new Date(album.memoryCreationDate).toLocaleDateString()}
            </p>
          </div>

          <div>
          <button
            onClick={() => copyToClipboard(album.albumLink)}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
              >
            <ClipboardIcon className="w-5 h-5 text-white" />
            <span>Link</span> 
            </button>

          </div>

        </div>

        {/* Invite Section */}
        <button
          onClick={() => setShowInviteSection(!showInviteSection)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-700 transition-all"
        >
          {showInviteSection ? 'Ocultar Invitaciones' : 'Invitar Usuarios'}
        </button>

        {showInviteSection && (
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
          
        )}
                {/* Camera Button */}
                <button
          onClick={() => setShowPublicationForm(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-700 transition-all"
        >
          <CameraIcon className="w-5 h-5 mr-2" />
          Crear Publicación
        </button>

        {/* Publication Form */}
        {showPublicationForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-96 relative">
              <button
                onClick={() => setShowPublicationForm(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-4">Nueva Publicación</h2>
              <div className="mb-4">
                <label htmlFor="description" className="block font-medium mb-1">
                  Descripción
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="file" className="block font-medium mb-1">
                  Archivo
                </label>
                <input
                  id="file"
                  type="file"
                  accept={isVideo ? 'video/*' : 'image/*'}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="file-input file-input-bordered file-input-success w-full max-w-xs" 
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="mr-4">Tipo:</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsVideo(false)}
                    className={`px-4 py-2 rounded-lg ${
                      !isVideo ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    Foto
                  </button>
                  <button
                    onClick={() => setIsVideo(true)}
                    className={`px-4 py-2 rounded-lg ${
                      isVideo ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    Video
                  </button>
                </div>
              </div>
              <button
                onClick={handleCreatePublication}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Publicar
              </button>
            </div>
          </div>
         )} </div>
  
      </motion.div>
    </AuroraBackground>
  );
};

export default AlbumPage;