import "../Estilos_F/Usuarios.css";
import "../Estilos_F/Administrador.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faSearch, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Users, PawPrint, Stethoscope, ShieldCheck, LogOut } from 'lucide-react';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    tipoDoc: "DNI",
    numDoc: "",
    email: "",
    telefono: "",
    password: ""
  });

  useEffect(() => {
    fetch('/api/usuarios')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los usuarios');
        }
        return response.json();
      })
      .then((data) => {
        setUsuarios(data);
      })
      .catch((error) => {
        mostrarNotificacion('Error al obtener los usuarios.', 'error');
        console.error('Error al obtener los usuarios:', error);
      });
  }, []);

  const handleEliminar = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar este usuario?");
    if (confirmacion) {
      axios.delete(`/api/eliminar-usuario/${id}`)
        .then(() => {
          setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
          mostrarNotificacion('Usuario eliminado correctamente.', 'exito');
        })
        .catch((error) => {
          mostrarNotificacion('Error al eliminar el usuario.', 'error');
          console.error('Error al eliminar el usuario:', error);
        });
    }
  };

  const handleEditar = (usuario) => {
    setEditandoId(usuario.id);
    setNuevoUsuario({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      tipoDoc: usuario.tipoDoc,
      numDoc: usuario.numDoc,
      email: usuario.email,
      telefono: usuario.telefono,
      password: ""
    });
    setMostrarFormulario(true);
  };

  const handleAgregar = () => {
    setEditandoId(null);
    setNuevoUsuario({
      nombre: "",
      apellido: "",
      tipoDoc: "DNI",
      numDoc: "",
      email: "",
      telefono: "",
      password: ""
    });
    setMostrarFormulario(true);
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setNuevoUsuario({
      nombre: "",
      apellido: "",
      tipoDoc: "DNI",
      numDoc: "",
      email: "",
      telefono: "",
      password: ""
    });
    setEditandoId(null);
  };

  const mostrarNotificacion = (mensaje, tipo) => {
    setNotificacion({ mostrar: true, mensaje, tipo });
    setTimeout(() => {
      setNotificacion({ mostrar: false, mensaje: "", tipo: "" });
    }, 5000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, apellido, tipoDoc, numDoc, email, telefono, password } = nuevoUsuario;

    if (nombre && apellido && tipoDoc && numDoc && email && telefono && (editandoId || password)) {
      if (editandoId) {
        const datosActualizados = { ...nuevoUsuario };
        if (!password) delete datosActualizados.password;

        axios.put(`/api/actualizar-usuario/${editandoId}`, datosActualizados)
          .then(() => {
            setUsuarios(usuarios.map(usuario =>
              usuario.id === editandoId ? { ...usuario, ...datosActualizados } : usuario
            ));
            mostrarNotificacion('Usuario actualizado correctamente.', 'exito');
            handleCancelar();
          })
          .catch((error) => {
            mostrarNotificacion('Error al actualizar el usuario.', 'error');
            console.error('Error al actualizar el usuario:', error);
          });
      } else {
        axios.post('/api/registro-usuario', nuevoUsuario)
          .then((response) => {
            setUsuarios([
              ...usuarios,
              {
                id: response.data?.id || (usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1),
                ...nuevoUsuario,
                fechaRegistro: new Date().toISOString().split("T")[0]
              }
            ]);
            mostrarNotificacion('Usuario registrado exitosamente.', 'exito');
            handleCancelar();
          })
          .catch((error) => {
            mostrarNotificacion('Error al registrar el usuario.', 'error');
            console.error('Error al registrar el usuario:', error);
          });
      }
    } else {
      mostrarNotificacion("Todos los campos son obligatorios.", 'error');
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const terminoBusqueda = busqueda.toLowerCase();
    return (
      usuario.nombre.toLowerCase().includes(terminoBusqueda) ||
      usuario.apellido.toLowerCase().includes(terminoBusqueda) ||
      usuario.numDoc.toLowerCase().includes(terminoBusqueda) ||
      usuario.email.toLowerCase().includes(terminoBusqueda) ||
      usuario.telefono.toLowerCase().includes(terminoBusqueda)
    );
  });

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
        <div className="usuarios-container">
          <h1>Registro de Usuarios</h1>

          {notificacion.mostrar && (
            <div className={`notificacion ${notificacion.tipo}`}>
              {notificacion.mensaje}
            </div>
          )}

          <div className="acciones-superiores">
            <button className="btn-agregar" onClick={handleAgregar}>
              <FontAwesomeIcon icon={faPlus} /> Nuevo Usuario
            </button>
            <button className="btn-reiniciar" onClick={() => setBusqueda("")}>Limpiar Búsqueda</button>
          </div>

          {mostrarFormulario && (
            <form className="formulario-nuevo" onSubmit={handleSubmit}>
            <h3>{editandoId ? "Editar Usuario" : "Agregar Usuario"}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nuevoUsuario.nombre}
                  onChange={(e) =>
                    setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
                  }
                  pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
                  title="El nombre solo debe contener letras"
                  required
                />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  placeholder="Apellido"
                  value={nuevoUsuario.apellido}
                  onChange={(e) =>
                    setNuevoUsuario({ ...nuevoUsuario, apellido: e.target.value })
                  }
                  pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
                  title="El apellido solo debe contener letras"
                  required
                />
              </div>
            </div>
          
            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Documento</label>
                <select
                  value={nuevoUsuario.tipoDoc}
                  onChange={(e) =>
                    setNuevoUsuario({ ...nuevoUsuario, tipoDoc: e.target.value })
                  }
                  required
                >
                  <option value="DNI">DNI</option>
                  <option value="Cédula">Cédula</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>
              <div className="form-group">
                <label>Número de Documento</label>
                <input
                  type="text"
                  placeholder="Número de documento"
                  value={nuevoUsuario.numDoc}
                  onChange={(e) =>
                    setNuevoUsuario({ ...nuevoUsuario, numDoc: e.target.value })
                  }
                  pattern="^\d{5,12}$"
                  title="El número de documento debe contener solo números y entre 5 y 12 dígitos"
                  required
                />
              </div>
            </div>
          
            <div className="form-row"/>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={nuevoUsuario.email}
                  onChange={(e) =>
                    setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
                  }
                  pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
                  title="Ingrese un correo electrónico válido"
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  placeholder="Número de teléfono"
                  value={nuevoUsuario.telefono}
                  onChange={(e) =>
                    setNuevoUsuario({ ...nuevoUsuario, telefono: e.target.value })
                  }
                  pattern="^\d{10}$"
                  title="El número de teléfono debe tener exactamente 10 dígitos"
                  required
                />
              </div>
              
          
            <div className="form-buttons">
              <button type="submit" className="btn-guardar">
                <FontAwesomeIcon icon={editandoId ? faSave : faPlus} />{" "}
                {editandoId ? " Guardar Cambios" : " Registrar Usuario"}
              </button>
              <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                <FontAwesomeIcon icon={faTimes} /> Cancelar
              </button>
            </div>
          </form>
          
          )}

          <div className="busqueda-container">
            <input type="text" placeholder="Buscar Usuario..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            <FontAwesomeIcon icon={faSearch} />
          </div>

          <div className="tabla-usuarios">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Documento</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.apellido}</td>
                    <td>{usuario.numDoc}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.telefono}</td>
                    <td>
                      <button className="btn-editar" onClick={() => handleEditar(usuario)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="btn-eliminar" onClick={() => handleEliminar(usuario.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Usuarios;







