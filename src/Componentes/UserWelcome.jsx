import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPaw, FaCalendarAlt } from 'react-icons/fa';
import '../Estilos_F/User.css';

const UserWelcome = ({ userName }) => {
  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
  });

  useEffect(() => {
    const nombre = localStorage.getItem('nombre') || userName || 'Usuario';
    const email = localStorage.getItem('email') || 'usuario@email.com';
    setUserData({ nombre, email });
  }, [userName]);

  return (
    <div className="main-content">
      <h1>¡Bienvenido, {userData.nombre}!</h1>

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
  );
};

export default UserWelcome;
