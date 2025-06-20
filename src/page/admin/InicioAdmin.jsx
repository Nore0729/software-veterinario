import AdminLayout from "../../layout/AdminLayout";
import '../../styles/Administrador/InicioAdmin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faUsers,
  faUserTie,
  faUserShield,
  faChartLine,
  faCalendarAlt,
  faBell,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';

function DashboardAdmin() {
  const navigate = useNavigate();
  const [usuariosRegistrados, setUsuariosRegistrados] = useState(0);
  const [adminName, setAdminName] = useState('');

  // Los demás datos se mantienen estáticos por ahora
  const stats = {
    clientes: 58,
    veterinarios: 2,
    administradores: 1,
    citasHoy: 10,
    notificaciones: 5,
    mensajes: 3
  };

  useEffect(() => {
    // Obtener nombre del admin desde localStorage
    const nombre = localStorage.getItem('nombre');
    if (nombre) {
      setAdminName(nombre);
    }

    // --- LLAMADA A LA API CORREGIDA ---
    // Se asegura de que la URL incluya el prefijo del router de admin.
    fetch('http://localhost:3000/api/admin/usuarios_registrados')
      .then(res => {
        if (!res.ok) {
          throw new Error('La respuesta de la red no fue exitosa');
        }
        return res.json();
      })
      .then(data => {
        // La respuesta del backend es un array: [ { total_usuarios: 5 } ]
        // Por eso accedemos a data[0]
        if (data && data[0]?.total_usuarios !== undefined) {
          setUsuariosRegistrados(data[0].total_usuarios);
        }
      })
      .catch(err => {
        console.error("Error al cargar usuarios registrados:", err);
        // Opcional: podrías poner un estado de error aquí para mostrarlo en la UI
      });
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  const handleNuevoUsuarioClick = () => {
    navigate("/FormularioUsu");
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <div>
            <h1>Bienvenido, {adminName}</h1>
            <p>Aquí tienes un resumen de la actividad del sistema</p>
          </div>
          <div className="header-icons">
            <div className="notification-badge">
              <FontAwesomeIcon icon={faBell} />
              <span>{stats.notificaciones}</span>
            </div>
            <div className="notification-badge">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>{stats.mensajes}</span>
            </div>
          </div>
        </header>

        {/* Estadísticas principales */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="stat-info">
              <h3>Usuarios registrados</h3>
              {/* Usamos el estado que se llena con la API */}
              <p className="stat-number">{usuariosRegistrados}</p>
              <p className="stat-trend positive">↑ 12% este mes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon clients">
              <FontAwesomeIcon icon={faUserTie} />
            </div>
            <div className="stat-info">
              <h3>Clientes activos</h3>
              <p className="stat-number">{stats.clientes}</p>
              <p className="stat-trend positive">↑ 5% este mes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon vets">
              <FontAwesomeIcon icon={faUserShield} />
            </div>
            <div className="stat-info">
              <h3>Veterinarios activos</h3>
              <p className="stat-number">{stats.veterinarios}</p>
              <p className="stat-trend negative">↓ 2% este mes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon admins">
              <FontAwesomeIcon icon={faUserShield} />
            </div>
            <div className="stat-info">
              <h3>Administradores</h3>
              <p className="stat-number">{stats.administradores}</p>
              <p className="stat-trend neutral">→ Sin cambios</p>
            </div>
          </div>
        </div>

        <section className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={handleNuevoUsuarioClick}>
              <FontAwesomeIcon icon={faUserPlus} />
              Nuevo Usuario
            </button>
          </div>
        </section>

        <div className="dashboard-bottom">
          <div className="appointments-card">
            <h2>
              <FontAwesomeIcon icon={faCalendarAlt} />
              Citas para hoy
            </h2>
            <div className="appointments-count">
              <span>{stats.citasHoy}</span>
              <button>Ver todas</button>
            </div>
            <div className="appointments-list">
              <p>Lista de citas programadas para hoy...</p>
            </div>
          </div>

          <div className="activity-card">
            <h2>
              <FontAwesomeIcon icon={faChartLine} />
              Actividad reciente
            </h2>
            <div className="activity-list">
              <p>Últimas acciones en el sistema...</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default DashboardAdmin;