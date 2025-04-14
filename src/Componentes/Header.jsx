import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../imagenes/GuzPet.png";
import "../Estilos_F/Header.css";

const Header = () => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo-container">
        <img 
          src={logo || "https://via.placeholder.com/150x50?text=GuzPet"} 
          alt="Logo GuzPet" 
          className="logo" 
        />
      </div>

      <nav className="nav-menu">
        <ul className="menu-list">
          <li>
            <Link to="/" className="nav-link">Inicio</Link>
          </li>
          <li>
            <Link to="/servicios" className="nav-link">Servicios</Link>
          </li>
          <li>
            <Link to="/ubicacion" className="nav-link">Ubicación</Link>
          </li>
          <li>
            <Link to="/mascotas" className="nav-link">Mascotas</Link>
          </li>
        </ul>
      </nav>

      <div className="header-buttons">
        <div className="options-wrapper">
          <button 
            className="options-btn"
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
          >
            Opciones
          </button>
          {isOptionsOpen && (
            <div className="dropdown-menu">
              <Link to="/propietarios" className="dropdown-link">Registrar</Link>
              <Link to="/contacto" className="dropdown-link">Contacto</Link>
            </div>
          )}
        </div>
        <Link to="/login" className="login-btn">
          Iniciar Sesión
        </Link>
      </div>
    </header>
  );
};

export default Header;