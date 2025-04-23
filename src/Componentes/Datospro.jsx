import { useEffect, useState } from 'react';
import '../Estilos_F/Datospro.css';
import axios from 'axios';

const Datospro = () => {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('email'); // o usa el ID si lo tienes
    if (email) {
      axios.get(`http://localhost:3001/propietarios/${email}`)
        .then(response => {
          setDatos(response.data);
        })
        .catch(error => {
          console.error('Error al obtener datos del propietario:', error);
        });
    }
  }, []);

  if (!datos) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="datospro-container">
      <h2>Mi cuenta</h2>
      <form className="datospro-form">
        <label>Tipo de Documento:</label>
        <input type="text" value={datos.tipoDocumento} readOnly />

        <label>Documento:</label>
        <input type="text" value={datos.documento} readOnly />

        <label>Nombre:</label>
        <input type="text" value={datos.nombre} readOnly />

        <label>Fecha de Nacimiento:</label>
        <input type="date" value={datos.fechaNacimiento?.split('T')[0]} readOnly />

        <label>Teléfono:</label>
        <input type="text" value={datos.telefono} readOnly />

        <label>Email:</label>
        <input type="email" value={datos.email} readOnly />

        <label>Dirección:</label>
        <input type="text" value={datos.direccion} readOnly />

        <label>Fecha de Registro:</label>
        <input type="text" value={new Date(datos.fechaRegistro).toLocaleString()} readOnly />
      </form>
    </div>
  );
};

export default Datospro;
