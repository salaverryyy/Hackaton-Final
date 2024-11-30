import { Routes, Route, useLocation  } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateEventPage from './pages/CreateEventPage';
import CreateMemoryPage from './pages/CreateMemoryPage';
import AlbumPage from './pages/AlbumPage';
import ConfirmPage from './pages/ConfirmPage';
import ProfilePage from './pages/ProfilePage';
import EventosPage from './pages/EventosPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';


const App = () => {
  const location = useLocation();
 // Determinar si estamos en RegisterPage o LoginPage
 const showNavbar = location.pathname !== '/' && location.pathname !== '/login';

 return (
   <div className="flex flex-col min-h-screen">
     {/* Mostrar la Navbar solo si no estamos en RegisterPage o LoginPage */}
     {showNavbar && <Navbar />}
     <main className="flex-grow">
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas */}
        <Route
          path="/homePage"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              <CreateEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-memory"
          element={
            <ProtectedRoute>
              <CreateMemoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/album/:memoryId"
          element={
            <ProtectedRoute>
              <AlbumPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/confirm/:invitationUUID"
          element={
            <ProtectedRoute>
              <ConfirmPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventosPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} /> {/* Ruta para páginas no encontradas */}


      </Routes>
      </main>
      </div>
  );
};

export default App;
