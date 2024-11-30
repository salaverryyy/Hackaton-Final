interface BackgroundImageProps {
  children?: React.ReactNode;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ children }) => {
  // Ruta de la imagen estática
  const backgroundUrl = '/bg-eventify.jpg'; // Asegúrate de que la imagen esté en la carpeta `public`

  return (
    <div
      className="min-h-screen p-10 relative"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundImage;


