import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MemoryCard from '../components/MemoryCard';
import { getUserIdFromToken } from '../api';

interface Memory {
  memoryId: number;
  coverPhoto: string;
  event: {
    eventId: number;
    eventName: string;
    eventDate: string;
  } | null;
}

const ITEMS_PER_PAGE = 6; // Limit to 6 cards per page

const EventosPage: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // To track pagination
  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await axios.get(
          `http://54.146.73.88:8080/memories/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setMemories(response.data);
      } catch (error) {
        console.error('Error fetching memories:', error);
      }
    };

    fetchMemories();
  }, [userId]);

  // Calculate the displayed memories for the current page
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedMemories = memories.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (endIndex < memories.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="pt-20"> 
    <div className="container mx-auto">
      <h1 className="text-6xl font-bold text-center text-white drop-shadow-lg mb-0 animate-bounce custom-title">
        Tus Recuerdos y Eventos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {displayedMemories.length > 0 ? (
          displayedMemories.map((memory) => (
            <MemoryCard key={memory.memoryId} memory={memory} />
          ))
        ) : (
          <div className="col-span-3 mt-10 text-center text-white text-3xl font-light bg-white/20 p-4 rounded-lg shadow-md">
            No tienes recuerdos o eventos aún. <br />
            ¡Comienza creando uno ahora!
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {memories.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className={`px-4 py-2 bg-gray-200 rounded-lg ${
              currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
            }`}
          >
            &larr; Anterior
          </button>
          <button
            onClick={handleNextPage}
            disabled={endIndex >= memories.length}
            className={`px-4 py-2 bg-gray-200 rounded-lg ${
              endIndex >= memories.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
            }`}
          >
            Siguiente &rarr;
          </button>
        </div>
      )}
    </div>
  </div>
  );
};

export default EventosPage;
