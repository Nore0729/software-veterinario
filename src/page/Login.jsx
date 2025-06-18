import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const navigate = useNavigate();

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

    const usuariosMock = [
      {
        id: 1,
        nombre: 'Juan Pérez',
        email: 'juan.perez@gmail.com',
        password: 'Cliente2025@',
        rol: 'propietario',
        documento: '12345678',
        telefono: '1234567890',
        direccion: 'Calle Falsa 123'
      },
      {
        id: 2,
        nombre: 'Ana Martínez',
        email: 'veterinario@gmail.com',
        password: 'Vet2025@',
        rol: 'veterinario',
        documento: '87654321',
        telefono: '0987654321',
        especialidad: 'Cirugía'
      },
      {
        id: 3,
        nombre: 'Carlos Gómez',
        email: 'yenifergb07@gmail.com',
        password: 'YENIfer2021@',
        rol: 'administrador',
        documento: '11122333',
        telefono: '5554443322',
        nivel_acceso: 'alto'
      }
    ];
  
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password,
      });

      const { nombre, email: userEmail, rol } = response.data;

      if (!nombre || !userEmail) {
        throw new Error('Datos de usuario incompletos desde backend');
      }

      localStorage.setItem('nombre', nombre);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('rol', rol || ''); // Guarda rol si existe

      setErrorGeneral('');
      setFailedAttempts(0);

      // Navegar según rol (ajusta las rutas si es necesario)
      if (rol === 'propietario') navigate('/UserWelcome');
      else if (rol === 'veterinario') navigate('/VeterinarioPer');
      else if (rol === 'administrador') navigate('/InicioAdmin');
      else navigate('/UserWelcome');

    } catch (err) {
      console.error('Error en login backend:', err);

      // Fallback a usuarios mock si backend falla
      try {
        const user = usuariosMock.find(
          (usuario) => usuario.email === email && usuario.password === password
        );

        if (!user) {
          setErrorGeneral('Credenciales incorrectas');
          setFailedAttempts((prev) => prev + 1);
          if (failedAttempts + 1 >= 3) {
            alert('Contraseña incorrecta 3 veces. Por favor, recupera tu contraseña.');
            navigate('/Recuperarcontraseña');
          }
          return;
        }

        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('nombre', user.nombre);
        localStorage.setItem('email', user.email);
        localStorage.setItem('rol', user.rol);

        setErrorGeneral('');
        setFailedAttempts(0);

        switch (user.rol) {
          case 'propietario':
            navigate('/UserWelcome');
            break;
          case 'veterinario':
            navigate('/VeterinarioPer');
            break;
          case 'administrador':
            navigate('/InicioAdmin');
            break;
          default:
            navigate('/UserWelcome');
        }
      } catch (error) {
        console.error('Error en login con rol (mock):', error);
        setErrorGeneral('Error al autenticar el rol');
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
        <h2>🐾 Pets-Lovers</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
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
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

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
