import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { BackgroundGradient } from "../components/ui/background-gradient";
import Heart from "react-heart";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import axios from "axios";
import { getUserIdFromToken } from "../api";
import { getUserById } from "../api"; // Importa la función desde el archivo api.ts



interface Publication {
  id: number;
  description: string;
  mediaUrl: string | null;
  likes: number;
  isLiked: boolean;
}

interface Like {
  id: number;
  publicationId: number;
  userId: number;
}

interface Comment {
  id: number;
  content: string;
  commentDate: string;
  username: string;
}

const CarouselForPublications: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>(""); // Almacena el texto del nuevo comentario

  const userId = Number(getUserIdFromToken());
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const userData = await getUserById(userId);
          setUser(userData);
        } catch (err) {
          console.log("Error fetching user details.");
        }
      };
  
      fetchUser();
    }, [userId]);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        // Obtener publicaciones
        const publicationResponse = await axios.get(
          `http://54.146.73.88:8080/publication/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Obtener todos los likes
        const likeResponse = await axios.get(
          `http://54.146.73.88:8080/likePublication`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const allLikes: Like[] = likeResponse.data;

        // Crear estado inicial de publicaciones, verificando si el usuario ya dio like
        const fetchedPublications = await Promise.all(
          publicationResponse.data.map(async (publication: any) => {
            try {
              const photoResponse = await axios.get(
                `http://54.146.73.88:8080/publication/${publication.id}/publication`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              const likeCountResponse = await axios.get(
                `http://54.146.73.88:8080/publication/${publication.id}/likes/count`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              // Verificar si el usuario ya dio like a esta publicación
              const userLiked = allLikes.some(
                (like) =>
                  like.publicationId === publication.id && like.userId === Number(userId)
              );

              return {
                id: publication.id,
                description: publication.description,
                mediaUrl: photoResponse.data,
                likes: likeCountResponse.data.likeCount || 0,
                isLiked: userLiked,
              };
            } catch (error) {
              console.error(
                `Error fetching data for publication ${publication.id}:`,
                error
              );
              return {
                id: publication.id,
                description: publication.description,
                mediaUrl: null,
                likes: 0,
                isLiked: false,
              };
            }
          })
        );

        setPublications(fetchedPublications);
      } catch (error) {
        console.error("Error fetching publications or likes:", error);
      }
    };

    fetchPublications();
  }, [userId]);

    // Cargar comentarios de una publicación
    const loadComments = async (publicationId: number) => {
      try {
        const response = await axios.get(
          `http://54.146.73.88:8080/comment/publicaciones/${publicationId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
  
    // Agregar un comentario
    const addComment = async () => {
      if (!newComment.trim() || !selectedPublication) return;
      try {
        const response = await axios.post(
          `http://54.146.73.88:8080/comment/publicaciones/${selectedPublication.id}/comentarios`,
          { content: newComment },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setComments((prev) => [...prev, response.data]);
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    };
  
    // Eliminar un comentario
    const deleteComment = async (commentId: number) => {
      try {
        await axios.delete(`http://54.146.73.88:8080/comment/${commentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    };

  const toggleLike = async (publicationId: number, currentLiked: boolean) => {
    try {
      const endpoint = currentLiked
        ? `http://54.146.73.88:8080/likePublication/${publicationId}/unlike`
        : `http://54.146.73.88:8080/likePublication/${publicationId}/like`;

      await axios.post(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Actualizar estado local
      setPublications((prev) =>
        prev.map((pub) =>
          pub.id === publicationId
            ? {
                ...pub,
                likes: currentLiked ? pub.likes - 1 : pub.likes + 1,
                isLiked: !currentLiked,
              }
            : pub
        )
      );

      if (selectedPublication?.id === publicationId) {
        setSelectedPublication((prev) =>
          prev
            ? {
                ...prev,
                likes: currentLiked ? prev.likes - 1 : prev.likes + 1,
                isLiked: !currentLiked,
              }
            : null
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  if (publications.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No hay publicaciones aún.</p>;
  }

  return (
    <>
      <Carousel
        opts={{
          align: "start",
        }}
        orientation="vertical"
        className="w-full max-w-xs mx-auto mt-8"
      >
        <CarouselContent className="h-[400px]">
          {publications.map((publication) => (
            <CarouselItem key={publication.id} className="pt-1">
              <div className="p-2">
                <BackgroundGradient>
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-4">
                      {publication.mediaUrl ? (
                        <img
                          src={publication.mediaUrl}
                          alt="Publicación"
                          className="w-full h-40 object-cover rounded-lg mb-4 cursor-pointer"
                          onClick={() => {
                            setSelectedPublication(publication);
                            loadComments(publication.id); // Cargar los comentarios asociados a la publicación
                          }}
                          
                        />
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-lg mb-4">
                          <p className="text-gray-500">Sin imagen</p>
                        </div>
                      )}
                      <div className="flex justify-between items-center w-full">
                        <p className="text-sm text-gray-700">{publication.description}</p>
                        <div style={{ width: "2rem" }}>
                          <Heart
                            isActive={publication.isLiked}
                            onClick={() =>
                              toggleLike(publication.id, publication.isLiked)
                            }
                            animationScale={1.2}
                            animationTrigger="both"
                            animationDuration={0.2}
                            className={`customHeart${publication.isLiked ? " active" : ""}`}
                          />
                        </div>
                      </div>
                      <p className="text-white text-sm mt-2">
                        {publication.likes} likes
                      </p>
                    </CardContent>
                  </Card>
                </BackgroundGradient>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Popup */}
      {selectedPublication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-3/4 h-3/4 overflow-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 text-2xl"
              onClick={() => setSelectedPublication(null)}
            >
              &times;
            </button>
            <div className="flex flex-col md:flex-row">
              <img
                src={selectedPublication.mediaUrl || ""}
                alt="Publicación ampliada"
                className="w-full md:w-1/2 object-contain rounded-lg"
              />
              <div className="flex flex-col justify-between w-full md:w-1/2 p-4">
                <p className="text-gray-700">{selectedPublication.description}</p>
                <div className="flex items-center mb-4">
                  <div style={{ width: "2rem" }}>
                    <Heart
                      isActive={selectedPublication.isLiked}
                      onClick={() =>
                        toggleLike(
                          selectedPublication.id,
                          selectedPublication.isLiked
                        )
                      }
                      animationScale={1.2}
                      animationTrigger="both"
                      animationDuration={0.2}
                      className={`customHeart${
                        selectedPublication.isLiked ? " active" : ""
                      }`}
                    />
                  </div>
                  <p className="ml-2">{selectedPublication.likes} likes</p>
                </div>
                <textarea
  value={newComment}
  onChange={(e) => setNewComment(e.target.value)}
  placeholder="Escribe un comentario..."
  className="border p-2 w-full mt-2 rounded-md"
></textarea>
<button
  onClick={addComment}
  className="mt-2 bg-blue-500 text-white p-2 rounded-md"
>
  Comentar
</button>
<div className="mt-4 space-y-2">
  {comments.map((comment) => (
    <div
      key={comment.id}
      className="border p-2 rounded-md flex justify-between items-center"
    >
      <div>
        <p className="text-gray-700">{comment.content}</p>
        <p className="text-xs text-gray-500">
          {user.username} - {new Date(comment.commentDate).toLocaleString()}
        </p>
      </div>
      <button
        onClick={() => deleteComment(comment.id)}
        className="text-red-500 text-lg"
      >
        &times;
      </button>
    </div>
  ))}
</div>


              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CarouselForPublications;
