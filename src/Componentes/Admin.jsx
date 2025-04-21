import "../Estilos_F/Administrador.css"
import { Outlet } from "react-router-dom"; // Asegúrate de tenerlo importado

function Administrador() {
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
          <li><a href="/Usuarios">Usuarios</a></li>
          <li><a href="/MasRegis">Mascotas</a></li>
          <li><a href="/Veterinarios">Veterinarios</a></li>
          <li><a href="/Roles">Roles</a></li>
        </ul>
      </nav>
      <main className="admin-main">
        <Outlet /> 
      </main>
    </div>
  );
}

export default Administrador;
