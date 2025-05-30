import "../Estilos_F/MenuAdmin.css"
import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Users, Stethoscope, ShieldCheck, LogOut, ChevronDown } from "lucide-react"

function Administrador() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [adminName, setAdminName] = useState('')
  const navigate = useNavigate() // Agregar el hook de navigate para redirigir

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleMouseEnter = () => {
    setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    setDropdownOpen(false)
  }

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Limpiar el localStorage (o sessionStorage si es necesario)
    localStorage.clear(); // Elimina todos los datos almacenados en localStorage

    // Redirigir al usuario a la página de login
    navigate("/login"); // O la ruta correspondiente a tu login
  }

  const defaultContent = (
    <div className="admin-header-actions">
      <h1 className="admin-heading">Bienvenido al Panel de Administración</h1>
    </div>
  )

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="logo-petlovers">
            <img src="https://raw.githubusercontent.com/Nore0729/Img-soft-veterinario/refs/heads/main/GuzPet.png" alt="logo-petlovers" />
          </div>
          <div className="admin-user-section">
            <div className="admin-avatar-wrapper">
              <span>perfil</span>
            </div>
            <div className="Cerrar-sesion">
              <button onClick={handleLogout}> {/* Agregar la función al botón */}
                <LogOut className="nav-icon" size={18} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul>
          <li>
            <a href="/InicioAdmin">
              <Stethoscope className="nav-icon" size={18} />
              <span>Inicio</span>
            </a>
          </li>
          <li
            className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a href="#" className="dropdown-toggle">
              <Users className="nav-icon" size={18} />
              <span>Usuarios</span>
            </a>
            <ul className={`dropdown-content ${dropdownOpen ? "show" : ""}`}>
              <li>
                <a href="/clientes">
                  <span>Clientes</span>
                </a>
              </li>
              <li>
                <a href="/Veterinarios">
                  <span>Veterinarios</span>
                </a>
              </li>
              <li>
                <a href="/Admin">
                  <span>Administradores</span>
                </a>
              </li>
              <li>
                <a href="/Roles">
                  <span>Roles</span>
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/ServiciosAdmin">
              <Stethoscope className="nav-icon" size={18} />
              <span>Servicios</span>
            </a>
          </li>
        </ul>
      </nav>

      <main className="admin-main">
        <Outlet />
      </main>

      {sidebarOpen && <div className="sidebar-backdrop" onClick={toggleSidebar}></div>}
    </div>
  )
}

export default Administrador;

