import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import '../Auth.css'; 

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      navigate('/login', { replace: true });
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al registrarse.');
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box">
        <div className="">
          <div className="top">
            <span>
              ¿Ya tienes una cuenta?{' '}
              <button onClick={() => navigate('/login')} className="link">
                Inicia Sesión
              </button>
            </span>
            <header>Crear Cuenta</header>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="two-forms">
              <div className="input-box space-y-6">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Nombre"
                  className="input-field"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <i className="bx bx-user"></i>
              </div>
              <div className="input-box space-y-6">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Apellido"
                  className="input-field"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <i className="bx bx-user"></i>
              </div>
            </div>
            <div className="input-box space-y-6">
              <input
                type="text"
                name="username"
                placeholder="Nombre de Usuario"
                className="input-field"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <i className="bx bx-user-circle"></i>
            </div>
            <div className="input-box space-y-6">
              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <i className="bx bx-envelope"></i>
            </div>
            <div className="input-box space-y-6">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                className="input-field "
                value={formData.password}
                onChange={handleChange}
                required
              />
              <i className="bx bx-lock-alt"></i>
            </div>
            <div className="input-box space-y-6">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar Contraseña"
                className="input-field"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <i className="bx bx-lock"></i>
            </div>
            {errorMessage && (
  <p style={{ color: 'white' }}>
    {errorMessage}
  </p>
)}

            <div className="input-box space-y-6">
              <button type="submit" className="submit">
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
