import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Estilos_F/Datospro.css';

const Actualizarpro = () => {
  const [datos, setDatos] = useState({
    tipoDocumento: '',
    documento: '',
    nombre: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    direccion: '',
    fechaRegistro: '',
    password: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      axios.get(`http://localhost:3000/api/propietarios/${email}`)
        .then(res => {
          const {
            tipo_Doc,
            doc,
            nombre,
            fecha_Nac,
            tel,
            email,
            direccion,
            fecha_Regis,
          } = res.data;

          setDatos({
            tipoDocumento: tipo_Doc || '',
            documento: doc || '',
            nombre: nombre || '',
            fechaNacimiento: fecha_Nac || '',
            telefono: tel || '',
            email: email || '',
            direccion: direccion || '',
            fechaRegistro: fecha_Regis || '',
            password: '',
          });
        })
        .catch(err => {
          console.error('Error al cargar datos:', err);
          alert('Error al cargar los datos del propietario');
        });
    }
  }, []);

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  const validarPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
    return regex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarPassword(datos.password)) {
      alert('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo.');
      return;
    }

    const emailOriginal = localStorage.getItem('email');

    const datosActualizar = {
      tel: datos.telefono,
      email: datos.email,
      direccion: datos.direccion,
      password: datos.password,
    };

    axios.put(`http://localhost:3000/api/propietarios/${emailOriginal}`, datosActualizar)
      .then(() => {
        alert('Datos actualizados correctamente');
        if (emailOriginal !== datos.email) {
          localStorage.setItem('email', datos.email);
        }
        navigate('/Datospro');
      })
      .catch(err => {
        alert('Error al actualizar datos');
        console.error(err);
      });
  };

  return (
    <div className="datospro-container">
      <h2>Actualizar datos</h2>
      <form className="datospro-form" onSubmit={handleSubmit}>

        <label>Tipo de Documento:</label>
        <input
          type="text"
          name="tipoDocumento"
          value={datos.tipoDocumento}
          readOnly
        />

        <label>Documento:</label>
        <input
          type="text"
          name="documento"
          value={datos.documento}
          readOnly
        />

        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={datos.nombre}
          readOnly
        />

        <label>Fecha de Nacimiento:</label>
        <input
          type="date"
          name="fechaNacimiento"
          value={datos.fechaNacimiento ? datos.fechaNacimiento.split('T')[0] : ''}
          readOnly
        />

        <label>Teléfono:</label>
        <input
          type="text"
          name="telefono"
          value={datos.telefono}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={datos.email}
          onChange={handleChange}
          required
        />

        <label>Dirección:</label>
        <input
          type="text"
          name="direccion"
          value={datos.direccion}
          onChange={handleChange}
          required
        />

        <label>Fecha de Registro:</label>
        <input
          type="text"
          name="fechaRegistro"
          value={datos.fechaRegistro ? new Date(datos.fechaRegistro).toLocaleString() : ''}
          readOnly
        />

        <label>Contraseña:</label>
        <input
          type="password"
          name="password"
          value={datos.password}
          onChange={handleChange}
          placeholder="Contraseña"
          required
        />

        <button className="btn-actualizar" type="submit">Guardar cambios</button>
      </form>
    </div>
  );
};

export default Actualizarpro;
