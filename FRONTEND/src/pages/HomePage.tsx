// src/pages/HomePage.tsx

import CarouselForPublications from '../components/CarouselForPublications';
import { Boxes } from "../components/ui/background-boxes"

const HomePage: React.FC = () => {
  return (
<div className="h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
  <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none"/>
  <Boxes />
<div className="pt-16"> {/* Agrega padding-top aquí */}


      <div className="container mx-auto py-8">
        <div>
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Bienvenido a Eventify
        </h1>
        </div>
        {/* Agregar el carrusel de publicaciones */}
        <div className="pt-16">
        <CarouselForPublications />
        </div>
      </div>
    </div>
</div>

  );
};

export default HomePage;
