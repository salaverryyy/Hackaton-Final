
import { CardBody, CardContainer } from "../components/ui/3d-card";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getMemoryCoverPhoto } from '../api';

interface Memory {
  memoryId: number;
  event: {
    eventId: number;
    eventName: string;
    eventDate: string;
  } | null;
}

const MemoryCard: React.FC<{ memory: Memory }> = ({ memory }) => {
  const [coverPhoto, setCoverPhoto] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoverPhoto = async () => {
      const photo = await getMemoryCoverPhoto(memory.memoryId);
      setCoverPhoto(photo);
    };

    fetchCoverPhoto();
  }, [memory.memoryId]);

  return (
    <CardContainer>
          <CardBody>
        <motion.div
          key={memory.memoryId}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => {
            if (memory.event?.eventId) {
              localStorage.setItem('selectedMemoryId', memory.memoryId.toString());
              navigate(`/album/${memory.memoryId}`);
            }
          }}
          className=" relative border rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300"
        >

            <div className="relative w-full h-40">
              <img
                src={coverPhoto}
                alt="Cover"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>

          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
              {memory.event ? (
                <>
                  <h2 className="text-lg font-bold text-white">{memory.event.eventName}</h2>
                  <p className="text-sm text-gray-300">Fecha del Evento: {memory.event.eventDate}</p>
                </>
              ) : (
                <p className="text-center text-gray-300">Sin evento asociado</p>
              )}
            
          </div>

        </motion.div>
        </CardBody>
        </CardContainer>

  );
};

export default MemoryCard;
