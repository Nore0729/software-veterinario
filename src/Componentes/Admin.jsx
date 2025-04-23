import "../Estilos_F/Administrador.css"
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Users, PawPrint, Stethoscope, ShieldCheck, LogOut, Menu } from 'lucide-react';

function Administrador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const defaultContent = (
    <div className="admin-header-actions">
      <h1 className="admin-heading">Bienvenido al Panel de Administración</h1>
    </div>
  );

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo-container">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <Menu size={20} />
            </button>
            <div className="admin-title">Pet Lovers</div>
          </div>
          <div className="admin-user-section">
            <div className="admin-avatar-wrapper">
              <img src="/placeholder.svg?height=32&width=32" alt="avatar" className="admin-avatar" />
              <div className="admin-user-info">
                <span className="admin-doctor-name">Dr. Rodríguez</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="admin-sidebar">
        <div className="sidebar-header">
          <h1>Menú</h1>
        </div>
        <ul>
          <li className="active">
            <a href="/Usuarios">
              <Users className="nav-icon" size={18} />
              <span>Usuarios</span>
            </a>
          </li>
          <li>
            <a href="/MasRegis">
              <PawPrint className="nav-icon" size={18} />
              <span>Mascotas</span>
            </a>
          </li>
          <li>
            <a href="/Veterinarios">
              <Stethoscope className="nav-icon" size={18} />
              <span>Veterinarios</span>
            </a>
          </li>
          <li>
            <a href="/Roles">
              <ShieldCheck className="nav-icon" size={18} />
              <span>Roles</span>
            </a>
          </li>
          <li>
            <a href="/">
              <LogOut className="nav-icon" size={18} />
              <span>Cerrar Sesión</span>
            </a>
          </li>
        </ul>
      </nav>
      <main className="admin-main">
        <Outlet /> 
      </main>
      
      {sidebarOpen && <div className="sidebar-backdrop" onClick={toggleSidebar}></div>}
    </div>
  );
}

export default Administrador;
