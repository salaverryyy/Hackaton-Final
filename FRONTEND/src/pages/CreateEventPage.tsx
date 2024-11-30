import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    eventDate: '',
    location: '',
  });

  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);

  // Obtén la clave API desde las variables de entorno
  const googleMapsApiKey = 'AIzaSyAfgFQ4sVj9w6sJ994RaPYon4xwynIsvfM';
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey, // Utiliza la clave API desde las variables de entorno
    libraries: ['places'], // Carga las bibliotecas necesarias
  });

  const geocodeLatLng = async (lat: number, lng: number) => {
    const geocoder = new window.google.maps.Geocoder();
    const latLng = { lat, lng };

    try {
      const response = await geocoder.geocode({ location: latLng });
      if (response.results[0]) {
        return response.results[0].formatted_address;
      } else {
        return 'Dirección no encontrada';
      }
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      return 'Error al obtener la dirección';
    }
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });

      const address = await geocodeLatLng(lat, lng);
      setFormData((prev) => ({
        ...prev,
        location: address,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://54.146.73.88:8080/event', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const eventId = response.data.eventId;
      navigate('/create-memory', { state: { eventId } });
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Hubo un problema al crear el evento. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center px-4"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1519125323398-675f0ddb6308)', // Cambia la imagen de fondo si lo deseas
      }}>
      {/* Capa de superposición para dar un efecto de oscuridad */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Título */}
      <div className="relative z-10 text-center mb-8">
        <h2 className="text-4xl font-extrabold text-orange-500">
          Crea Tu Evento <span className="animate-bounce">✨</span>
        </h2>
        <p className="text-gray-200 mt-2">
          ¡Hazlo memorable! Agrega todos los detalles importantes para que tus amigos digan <span className="font-bold text-orange-500">WOW</span>.
        </p>
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch justify-center lg:justify-between gap-8 w-full max-w-6xl">
        {/* Formulario */}
        <div className="bg-white/90 backdrop-blur-lg p-6 rounded-3xl shadow-2xl w-full lg:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-800">Nombre del Evento</span>
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                className="input input-bordered w-full bg-white/80 focus:ring-2 focus:ring-orange-300 shadow-inner text-sm py-2"
                placeholder="Nombre del evento"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-800">Descripción del Evento</span>
              </label>
              <textarea
                name="eventDescription"
                value={formData.eventDescription}
                onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
                className="textarea textarea-bordered w-full bg-white/80 focus:ring-2 focus:ring-orange-300 shadow-inner text-sm py-2"
                placeholder="Descripción del evento"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-800">Fecha del Evento</span>
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="input input-bordered w-full bg-white/80 focus:ring-2 focus:ring-orange-300 shadow-inner text-sm py-2"
                required
              />
            </div>

            <input
              type="text"
              name="location"
              value={formData.location}
              className="w-full border p-2 rounded mb-4 text-sm"
              placeholder="Dirección seleccionada"
              readOnly
            />

            <button
              type="submit"
              className="btn bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-2 rounded-xl w-full hover:shadow-lg transition-transform transform hover:scale-105 mt-4"
            >
              Crear Evento 🎉
            </button>
          </form>
        </div>

        {/* Mapa */}
        <div className="relative w-full lg:w-1/2 h-72 lg:h-auto rounded-3xl overflow-hidden shadow-lg">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={markerPosition || { lat: -12.046374, lng: -77.042793 }}
              zoom={12}
              onClick={handleMapClick}
            >
              {markerPosition && <Marker position={markerPosition} />}
            </GoogleMap>
          ) : (
            <p className="text-center text-gray-300">Cargando mapa...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
