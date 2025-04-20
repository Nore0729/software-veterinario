import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Estilos_F/Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const navigate = useNavigate();

  // Manejo del submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor completa ambos campos');
      return;
    }

    try {
      // 1. Llamada al backend para autenticar
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password
      });

      // 2. Guardar datos del usuario (incluyendo ID) en localStorage
      const { id, nombre, token } = response.data;
      localStorage.setItem('propietario', JSON.stringify({ id, nombre, email }));
      localStorage.setItem('token', token);

      // 3. Mostrar alerta de éxito y redirigir
      Swal.fire({
        title: `¡Bienvenido, ${nombre}!`,
        icon: 'success',
        timer: 2000
      });

      // 4. Redirigir al dashboard o formulario de mascotas
      navigate('/registrar-mascota');

    } catch (error) {
      // Manejo de errores
      const errorMsg = error.response?.data?.message || 'Error al iniciar sesión';
      setError(errorMsg);
      Swal.fire('Error', errorMsg, 'error');
    }
  };

  return (
    <div className="login-container">
      <div>
      <div>
        <h2>🐾 Patitas Felices</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
          <div className="form-group">
            <label>Correo electrónico:</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@vet.com"
              required
            />
          </div>

          <div className="form-group">
          <div className="form-group">
            <label>Contraseña:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {error && <p className="error-message">{error}</p>}

          <button type="submit">Iniciar Sesión</button>
        </form>

        <div className="login-links">
        <div className="login-links">
          <Link to="/Contraseña1">¿Olvidaste tu contraseña?</Link>
          <Link to="/Propietarios">Registrarse</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
