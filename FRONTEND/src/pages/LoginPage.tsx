import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import '../Auth.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await login(formData.email, formData.password);
      localStorage.setItem('token', token);
      navigate('/homePage');
    } catch (error) {
      setError('Error al iniciar sesión. Verifica tus credenciales e intenta de nuevo.');
    }
  };
  const handleRegisterRedirect = () => {
    navigate('/');
  };
  return (
    <div className="wrapper">
      <div className="form-box">
        <div className="login-container">
          <div className="top">
            <span>
              ¿No tienes una cuenta?{' '}
              <a href="#" onClick={() => navigate('/register')}>
                Regístrate
              </a>
            </span>
            <header>Iniciar Sesión</header>
          </div>
          <form onSubmit={handleLogin}>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <i className="bx bx-user"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                className="input-field"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <i className="bx bx-lock-alt"></i>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="input-box">
              <button type="submit" className="submit">
                Iniciar Sesión
              </button>
            </div>
            <div className="two-col">
              <div>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember"> Recuérdame</label>
              </div>
              <div>
                <a href="#">¿Olvidaste tu contraseña?</a>
              </div>
            </div>
          </form>
          <div className="text-center mt-6">
          <p className="text-gray-600">¿Nuevo aquí?</p>
          <button
            onClick={handleRegisterRedirect}
            className="mt-3 text-blue-500 hover:underline font-semibold"
          >
            Regístrate ahora
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
