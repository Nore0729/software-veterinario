// src/components/UserLayout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaUser, FaPaw, FaCalendarAlt, FaChevronRight, FaHome, 
  FaClipboard, FaBell, FaCog 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../Estilos_F/User.css';

const UserLayout = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
  });

  useEffect(() => {
    const nombre = localStorage.getItem('nombre') || 'Usuario';
    const email = localStorage.getItem('email') || 'usuario@email.com';
    setUserData({ nombre, email });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    {
      title: "Inicio",
      icon: <FaHome />,
      path: "/UserWelcome"
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
      title: "Configuración",
      icon: <FaCog />,
      subItems: [
        { label: "Mi Cuenta", path: "/Datospro" },
        { label: "Ayuda", path: "/Ayudapro" },
        { label: "Actualizar Datos", path: "/Actualizarpro" }
      ]
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
          {expanded && (
            <div className="user-info">
              <h3>{userData.nombre}</h3>
              <p>{userData.email}</p>
            </div>
          )}
        </div>

        <nav className="side-menu">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-item">
              {item.path ? (
                <Link to={item.path} className="menu-link" title={item.title}>
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
                        <Link key={subIndex} to={subItem.path} className="submenu-item">
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

          <div className="menu-item logout-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <span className="menu-link" title="Cerrar sesión">
              <span className="menu-icon"><FaUser /></span>
              {expanded && <span className="menu-text">Cerrar sesión</span>}
            </span>
          </div>
        </nav>
      </div>

      <div className="main-content">
        <Outlet /> {/* Aquí se renderizan las subrutas */}
      </div>
    </div>
  );
};

export default UserLayout;
