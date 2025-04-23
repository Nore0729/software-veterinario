import "../Estilos_F/VeterinarioPer.css";
import { Outlet, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMd, faCalendarAlt, faPaw, faNotesMedical, faSyringe, } from "@fortawesome/free-solid-svg-icons";

function Veterinario() {
  return (
    <div className="vet-container">
      <header className="vet-header">
        <div className="vet-header-content">
          <div className="vet-logo-container">
            <div className="vet-title">Pet Lovers</div>
          </div>
          <div className="vet-user-section">
            <div className="vet-avatar-wrapper">
              <img 
                src="/vet-avatar.png" 
                alt="avatar" 
                className="vet-avatar" 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div className="vet-user-info">
                <span className="vet-doctor-name">Dr. Veterinario</span>
                <span className="vet-specialty">Cirujano</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="vet-sidebar">
        <div className="sidebar-header">
          <h1>
            <FontAwesomeIcon icon={faUserMd} className="sidebar-icon" />
            Menú Veterinario
          </h1>
        </div>
        <ul>
          <li>
            <NavLink 
              to="/consultas" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <FontAwesomeIcon icon={faNotesMedical} />
              <span>Consultas</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/pacientes"
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <FontAwesomeIcon icon={faPaw} />
              <span>Pacientes</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/HistorialMedico"
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <FontAwesomeIcon icon={faNotesMedical} />
              <span>Historiales Médicos</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/cirugias"
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <FontAwesomeIcon icon={faSyringe} />
              <span>Cirugías</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/calendario"
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span>Calendario</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="vet-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Veterinario;