import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Estilos_F/Login.css';

export const Login = () => {
  // Estados
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Manejo del submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor completa ambos campos');
      return;
    }
    
    // Aquí iría tu lógica de autenticación
    console.log('Datos de login:', { email, password });
    setError('');
    alert(`Bienvenido, ${email}!`);
  };

  return (
    <div className="login-container">
      <div> {/* Contenedor principal agregado */}
        <h2>🐾 Patitas Felices</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group"> {/* Agregado className */}
            <label>Correo electrónico:</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@vet.com"
            />
          </div>

          <div className="form-group"> {/* Agregado className */}
            <label>Contraseña:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="error-message">{error}</p>} {/* Cambiado a className */}

          <button type="submit">Iniciar Sesión</button>
        </form>

        <div className="login-links"> {/* Agregado className */}
          <a href="#">¿Olvidaste tu contraseña?</a>
          <Link to="/Propietarios">Registrar</Link> {/* Eliminado className innecesario */}
        </div>
      </div>
    </div>
  );
};

export default Login;