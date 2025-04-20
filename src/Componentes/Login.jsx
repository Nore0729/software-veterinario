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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor completa ambos campos');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password
      });

      // Guardar todos los datos del usuario incluyendo tipoDocumento
      const { id, nombre, token, tipoDocumento } = response.data.user;
      localStorage.setItem('propietario', JSON.stringify({ 
        id, 
        nombre, 
        email,
        tipoDocumento 
      }));
      localStorage.setItem('token', token);

      Swal.fire({
        title: `¡Bienvenido, ${nombre}!`,
        icon: 'success',
        timer: 2000
      }).then(() => {
        navigate('/registrar-mascota');
      });

    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al iniciar sesión';
      setError(errorMsg);
      Swal.fire({
        title: 'Error',
        text: errorMsg,
        icon: 'error'
      });
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
              required
            />
          </div>

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

          <button type="submit">Iniciar Sesión</button>
        </form>

        <div className="login-links">
          <Link to="/Contraseña1">¿Olvidaste tu contraseña?</Link>
          <Link to="/Propietarios">Registrarse</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;