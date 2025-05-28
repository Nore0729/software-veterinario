import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  CalendarPlus,
  Stethoscope,
  Users2,
  Dog,
  LogOut,
} from "lucide-react";
import "../Estilos_F/VeterinarioPer.css";
import { logoutWithConfirmation } from "../Componentes/authUtils";

const Veterinarios = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    const logoutButton = document.querySelector(".vet-header-logout");
    if (logoutButton) {
      logoutButton.style.animation = "fadeOutRight 0.4s forwards";
      setTimeout(() => {
        logoutWithConfirmation();
      }, 400);
    } else {
      logoutWithConfirmation();
    }
  };

  return (
    <div className="veterinarios-container">
      <header className="vet-header">
        <div className="vet-header-logo">PET LOVERS</div>

        <div className="vet-header-right">
          <div className="vet-header-usuario">
            <span>Veterinario</span>
            <img src="/images/usuario.png" alt="Usuario" className="vet-usuario-img" />
          </div>

          <div className="vet-header-logout" onClick={handleLogout}>
            <LogOut className="vet-icon" />
            <span>Cerrar sesión</span>
          </div>
        </div>
      </header>

      <div className="vet-body">
        <nav className={`vet-sidebar ${sidebarOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Home className="vet-icon" />
              <Link to="/InicioVeterinario">Inicio</Link>
            </li>
            <li>
              <CalendarPlus className="vet-icon" />
              <Link to="/citas">Citas</Link>
            </li>
            <li>
              <Stethoscope className="vet-icon" />
              <Link to="/consultas">Consultas</Link>
            </li>
            <li>
              <Users2 className="vet-icon" />
              <Link to="/usuarios">Usuarios</Link>
            </li>
            <li>
              <Dog className="vet-icon" />
              <Link to="/mascotas">Mascotas</Link>
            </li>
          </ul>
        </nav>

        <main className="vet-content">
          <h1>Bienvenido a Pet Lovers</h1>
          <p>Elige una opción del menú para empezar.</p>
        </main>
      </div>
    </div>
  );
};

export default Veterinarios;
