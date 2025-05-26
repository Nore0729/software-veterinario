
import "../Estilos_F/MenuAdmin.css"
import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Users, Stethoscope, ShieldCheck, LogOut, ChevronDown } from "lucide-react"

function Administrador() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleMouseEnter = () => {
    setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    setDropdownOpen(false)
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
          <div className="admin-logo-container">
            <div className="admin-title">Pet Lovers</div>
          </div>
          <div className="admin-user-section">
            <div className="admin-avatar-wrapper">
              <img src="/placeholder.svg?height=32&width=32" alt="avatar" className="admin-avatar" />
              <div className="admin-user-info">
                <span className="admin-doctor-name">Dr. Rodríguez</span>
              </div>
            </div>
              <div className="Cerrar-sesion">
                <button>
                  <LogOut className="nav-icon" size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
          </div>
        </div>
      </header>

      <nav className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h1>Menú</h1>
        </div>
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
          <li>
            <a href="/Veterinarios">
              <Stethoscope className="nav-icon" size={18} />
              <span>Citas</span>
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
