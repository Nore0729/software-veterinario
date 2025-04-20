import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUser, FaPaw, FaCalendarAlt, FaChevronRight, 
  FaHome, FaClipboard, FaBell, FaCog 
} from 'react-icons/fa';
import '../Estilos_F/User.css';

const UserWelcome = ({ userName }) => {
  const [expanded, setExpanded] = useState(false);

  const menuItems = [
    {
      title: "Inicio",
      icon: <FaHome />,
      path: "/inicio"
    },
    {
      title: "Mi Perfil",
      icon: <FaUser />,
      path: "/perfil"
    },
    {
      title: "Mis Citas",
      icon: <FaCalendarAlt />,
      subItems: [
        { label: "Próximas citas", path: "/citas-proximas" },
        { label: "Historial", path: "/historial-citas", icon: <FaClipboard /> }
      ]
    },
    {
      title: "Mis Mascotas",
      icon: <FaPaw />,
      subItems: [
        { label: "Firulais", path: "/mascota/firulais" },
        { label: "Michi", path: "/mascota/michi" }
      ]
    },
    {
      title: "Recordatorios",
      icon: <FaBell />,
      path: "/recordatorios"
    },
    {
      title: "Configuración",
      icon: <FaCog />,
      path: "/configuracion"
    }
  ];

  return (
    <div className="user-dashboard">
      <div 
        className={`sidebar ${expanded ? 'expanded' : ''}`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="user-profile">
          <FaUser className="profile-icon" />
          {expanded && <h3>{userName || "Usuario"}</h3>}
        </div>
        
        <nav className="side-menu">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-item">
              {item.path ? (
                <Link 
                  to={item.path} 
                  className="menu-link"
                  title={item.title}
                >
                  <span className="menu-icon">{item.icon}</span>
                  {expanded && <span className="menu-text">{item.title}</span>}
                </Link>
              ) : (
                <>
                  <div className="menu-header" title={item.title}>
                    <span className="menu-icon">{item.icon}</span>
                    {expanded && (
                      <>
                        <span className="menu-text">{item.title}</span>
                        <FaChevronRight className="menu-arrow" />
                      </>
                    )}
                  </div>
                  {expanded && item.subItems && (
                    <div className="submenu">
                      {item.subItems.map((subItem, subIndex) => (
                        <Link 
                          key={subIndex} 
                          to={subItem.path} 
                          className="submenu-item"
                        >
                          {subItem.icon && <span className="submenu-icon">{subItem.icon}</span>}
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="main-content">
        <h1>¡Bienvenido, {userName}!</h1>
        
        <div className="dashboard-cards">
          <div className="info-card">
            <h2><FaPaw /> Tus Mascotas</h2>
            <div className="pet-list">
              <div className="pet-item">
                <img src="/placeholder-dog.jpg" alt="Firulais" />
                <div>
                  <h3>Firulais</h3>
                  <p>Próxima cita: 15 Nov 2023</p>
                </div>
              </div>
              <div className="pet-item">
                <img src="/placeholder-cat.jpg" alt="Michi" />
                <div>
                  <h3>Michi</h3>
                  <p>Vacuna pendiente</p>
                </div>
              </div>
            </div>
            <Link to="/mascotas" className="view-all">Ver todas →</Link>
          </div>
          
          <div className="info-card">
            <h2><FaCalendarAlt /> Próximas Citas</h2>
            <ul className="appointment-list">
              <li>
                <strong>15 Nov 2023 - 10:30 AM</strong>
                <p>Control anual - Dr. Pérez</p>
              </li>
              <li>
                <strong>20 Nov 2023 - 04:15 PM</strong>
                <p>Vacunación - Dra. Lopez</p>
              </li>
            </ul>
            <Link to="/citas" className="view-all">Ver calendario →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserWelcome;
