import React, { useState, useEffect } from 'react';
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
  const [isBlocked, setIsBlocked] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isBlocked && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && isBlocked) {
      setIsBlocked(false);
      setFailedAttempts(0);
      setErrorGeneral('');
    }
    return () => clearTimeout(timer);
  }, [isBlocked, countdown]);

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

    if (isBlocked) return;
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
        nombre: 'Yenifer Garcia',
        email: 'yenifergb07@gmail.com',
        password: 'YENIfer2021@',
        rol: 'administrador',
        documento: '11122333',
        telefono: '5554443322',
        nivel_acceso: 'alto'
      }
    ];

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      const { nombre, email: userEmail, rol, doc } = response.data;

      if (!nombre || !userEmail) {
        throw new Error('Datos de usuario incompletos desde backend');
      }

      localStorage.setItem('nombre', nombre);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('doc_pro', doc);
      localStorage.setItem('rol', rol || '');

      setErrorGeneral('');
      setFailedAttempts(0);

      if (rol === 'propietario') navigate('/UserWelcome');
      else if (rol === 'veterinario') navigate('/VeterinarioPer');
      else if (rol === 'administrador') navigate('/InicioAdmin');
      else navigate('/UserWelcome');

    } catch (err) {
      console.error('Error en login backend:', err);
      const user = usuariosMock.find(
        (usuario) => usuario.email === email && usuario.password === password
      );

      if (!user) {
        const attempts = failedAttempts + 1;
        setFailedAttempts(attempts);
        if (attempts >= 3) {
          setIsBlocked(true);
          setCountdown(60);
        } else {
          setErrorGeneral(`Credenciales incorrectas. Intentos restantes: ${3 - attempts}`);
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
    }
  };

  return (
    <div className={`login-container ${isBlocked ? 'blurred-background' : ''}`}>
      {isBlocked && (
        <div className="countdown-overlay">
          <div className="countdown-modal">
            <h2>Cuenta Bloqueada Temporalmente</h2>
            <p>Demasiados intentos fallidos. Por favor espere:</p>
            <div className="countdown-number">{countdown}</div>
            <p>segundos para volver a intentar</p>
          </div>
        </div>
      )}

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
              disabled={isBlocked}
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
                disabled={isBlocked}
              />
              <span
                className="password-toggle-icon"
                onClick={() => !isBlocked && setShowPassword(!showPassword)}
                style={{ cursor: isBlocked ? 'not-allowed' : 'pointer' }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {errorGeneral && <p className="error-message">{errorGeneral}</p>}

          <button 
            type="submit" 
            disabled={isBlocked}
            className={isBlocked ? 'blocked-button' : ''}
          >
            {isBlocked ? 'CUENTA BLOQUEADA' : 'Iniciar Sesión'}
          </button>
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