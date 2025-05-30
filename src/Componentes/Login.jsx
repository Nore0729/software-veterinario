import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Estilos_F/Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const navigate = useNavigate();

  // Función para validar formato de email simple
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const valor = e.target.value.toLowerCase();
    setEmail(valor);

    if (!validarEmail(valor)) {
      setEmailError('Correo electrónico inválido');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorGeneral('Por favor completa ambos campos');
      return;
    }

    if (emailError) {
      setErrorGeneral('Por favor corrige el correo electrónico');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password,
      });

      const { name, userEmail } = response.data;

      localStorage.setItem('nombre', name);
      localStorage.setItem('email', userEmail);

      setErrorGeneral('');
      setFailedAttempts(0); // resetear contador en login exitoso
      navigate('/UserWelcome');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);

      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      if (newFailedAttempts >= 3) {
        alert('Contraseña incorrecta 3 veces. Por favor, recupera tu contraseña.');
        navigate('/Recuperarcontraseña');
      } else {
        setErrorGeneral(err.response?.data?.message || 'Contraseña incorrecta. Intentos restantes: ' + (3 - newFailedAttempts));
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box login-image-side">
        <img
          src="https://raw.githubusercontent.com/Nore0729/Img-soft-veterinario/refs/heads/main/inicio.png"
          alt="Mascotas felices"
          className="login-image"
        />
      </div>

      <div className="login-box login-form-side">
        <h2>🐾 Patitas Felices</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange} // valida y convierte aquí
              placeholder="ejemplo@vet.com"
              autoComplete="username"
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Error general que no sea del email */}
          {errorGeneral && <p className="error-message">{errorGeneral}</p>}

          <button type="submit">Iniciar Sesión</button>
        </form>

        <div className="login-links">
          <Link to="/Recuperarcontraseña">¿Olvidaste tu contraseña?</Link>
          <Link to="/Propietarios">Registrar</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;


