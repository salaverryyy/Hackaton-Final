import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Corrige la importación de jwt-decode

const API_URL = 'http://54.146.73.88:8080';

// Interfaces
export interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface Memory {
  memoryId: number;
  memoryName: string;
  description: string;
  coverPhotoKey: string | null;
  event: {
    eventId: number;
    eventName: string;
    eventDate: string;
  } | null;
}

// JWT
// Interfaz del payload del token
interface JwtPayload {
  userId: string; // Generalmente contiene el userId
  sub: string;
  exp: number; // Tiempo de expiración
  iat: number; // Tiempo en que se emitió
}

// Decodificar el token para obtener el userId
export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded.userId; // Aquí se asume que `sub` contiene el userId
  } catch (error) {
    console.error('Error decodificando el token:', error);
    return null;
  }
};

// Función para registrar usuarios
export const registerUser = async (userData: User & { confirmPassword: string }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    return response.data; // Devuelve los datos del registro
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Hubo un problema al intentar registrar la cuenta. Inténtalo nuevamente.');
    }
  }
};

// Autenticación
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post<{ token: string }>(`${API_URL}/auth/login`, { email, password });
    localStorage.setItem('token', response.data.token);
    console.log('Login exitoso');
    return response.data.token; // Devuelve el token
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw new Error('Error al iniciar sesión. Por favor, revisa tus credenciales.');
  }
};

  //LOG OUT
  export const logoutUser = async (): Promise<void> => {
    try {
      const response = await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response.data); // Opcional: Muestra el mensaje de éxito
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };
  
// Configuración de headers autenticados
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontró un token de autenticación.');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

//userByID
export const getUserById = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/usuarios/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data; // Devuelve los datos del usuario
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error; // Propaga el error para manejarlo en el componente
  }
};
// Memorias
// Obtener recuerdos de un usuario específico
export const getUserMemories = async () => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error('No se pudo obtener el userId del token.');

  try {
    const response = await axios.get<Memory[]>(`${API_URL}/memories/user/${userId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener recuerdos:', error);
    throw error;
  }
};

// Crear una memoria con foto de portada opcional
export const createMemory = async (memoryData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/memories`, memoryData, {
      headers: {
        ...getAuthHeaders().headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear la memoria:', error);
    throw error;
  }
};

// Asociar una memoria con un evento
export const associateMemoryWithEvent = async (eventId: string, memoryId: string) => {
  try {
    await axios.post(
      `${API_URL}/event/${eventId}/memory/${memoryId}`,
      {},
      getAuthHeaders()
    );
  } catch (error) {
    console.error('Error al asociar la memoria con el evento:', error);
    throw error;
  }
};

// Obtener foto de portada de un recuerdo
export const getMemoryCoverPhoto = async (memoryId: number) => {
  try {
    const response = await axios.get(`${API_URL}/memories/${memoryId}/cover-photo`, getAuthHeaders());
    return response.data; // Retorna la URL presignada
  } catch (error) {
    console.error('Error al obtener la foto de portada:', error);
    throw error;
  }
};

// Eliminar foto de portada de un recuerdo
export const deleteMemoryCoverPhoto = async (memoryId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/memories/${memoryId}/cover-photo`, getAuthHeaders());
    return response.data; // Retorna mensaje de éxito
  } catch (error) {
    console.error('Error al eliminar la foto de portada:', error);
    throw error;
  }
};

// Eliminar un recuerdo
export const deleteMemory = async (memoryId: string) => {
  try {
    await axios.delete(`${API_URL}/memories/${memoryId}`, getAuthHeaders());
  } catch (error) {
    console.error('Error al eliminar el recuerdo:', error);
    throw error;
  }
};

// Usuario
// Obtener datos del usuario por ID
export const fetchUserData = async () => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error('No se pudo obtener el userId del token.');

  try {
    const response = await axios.get(`${API_URL}/usuarios/${userId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error;
  }
};

// Actualizar perfil del usuario
export const updateUserProfile = async (updatedData: any) => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error('No se pudo obtener el userId del token.');
  console.log(updatedData)
  try {
    const response = await axios.put(`${API_URL}/usuarios/${userId}`, updatedData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el perfil del usuario:', error);
    throw error;
  }
};

// Eliminar cuenta de usuario
export const deleteUser = async () => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error('No se pudo obtener el userId del token.');

  try {
    await axios.delete(`${API_URL}/usuarios/${userId}/delete`, getAuthHeaders());
  } catch (error) {
    console.error('Error al eliminar la cuenta del usuario:', error);
    throw error;
  }
};

// Foto de perfil
// Obtener foto de perfil del usuario
export const fetchProfilePic = async () => {
  try {
    const response = await axios.get(`${API_URL}/media/profile-pic`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener la foto de perfil:', error);
    throw error;
  }
};

// Eliminar foto de perfil del usuario
export const deleteProfilePic = async () => {
  try {
    await axios.delete(`${API_URL}/media/profile-pic`, getAuthHeaders());
  } catch (error) {
    console.error('Error al eliminar la foto de perfil:', error);
    throw error;
  }
};

// Actualizar foto de perfil del usuario
export const updateProfilePic = async (formData: FormData) => {
  console.log(formData)
  try {
    const response = await axios.post(`${API_URL}/media/profile-pic`, formData, {
      headers: {
        ...getAuthHeaders().headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la foto de perfil:', error);
    throw error;
  }
};


//GET MEMORY
export const getMemoryDetails = async (memoryId: number) => {
  console.log(memoryId);
  const response = await axios.get(`http://54.146.73.88:8080/memories/${memoryId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};




//ALBUM PAGE

// Fetch Album by UUID or Memory ID
export const fetchAlbumDetails = async (memoryId: string) => {
  const isUUID = memoryId.includes('-');
  if (isUUID) {
    const response = await axios.get(`http://54.146.73.88:8080/memories/uuid/${memoryId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } else {
    const response = await axios.get(`http://54.146.73.88:8080/memories/${memoryId}/album-uuid`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  }
};

// Search Users by Username
export const searchUsersByUsername = async (username: string) => {
  const response = await axios.get(`http://54.146.73.88:8080/usuarios/search?username=${username}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// Send Invitations
export const sendAlbumInvitations = async (accessCode: string, usernames: string[]) => {
  const response = await axios.post(
    'http://54.146.73.88:8080/invitation/sendByQr',
    {
      accessCode,
      usernames,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};

// Create Publication
export const createPublication = async (

  description: string,
  file: File,

) => {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('file', file);

  const response = await axios.post(
    `http://54.146.73.88:8080/publication/${localStorage.getItem('selectedMemoryId')}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;

};