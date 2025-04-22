import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Estilos_F/Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor completa ambos campos');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        email,
        password
      });

      const userName = response.data.nombre;   // Aquí obtienes el nombre del usuario
      localStorage.setItem('userName', userName);   // Guarda el nombre del propietario en localStorage
      console.log('Nombre guardado en localStorage:', userName); // <------------------- LOG AÑADIDO

      setError('');
      navigate('/UserWelcome');   // Redirige al componente UserWelcome
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <div>
        <h2>🐾 Patitas Felices</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@vet.com"
            />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Iniciar Sesión</button>
        </form>

        <div className="login-links">
          <Link to="/Contraseña1">¿Olvidaste tu contraseña?</Link>
          <Link to="/Propietarios">Registrar</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;



