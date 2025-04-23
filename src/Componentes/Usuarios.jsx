import "../Estilos_F/Usuarios.css";
import "../Estilos_F/Administrador.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faSearch, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import "../Estilos_F/Administrador.css";
import { Users, PawPrint, Stethoscope, ShieldCheck, LogOut } from 'lucide-react';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    tipoDoc: "DNI",
    numDoc: "",
    email: "",
    telefono: ""
  });

  useEffect(() => {
   
    setUsuarios([
      {
        id: 1,
        nombre: "Juan",
        apellido: "Pérez",
        tipoDoc: "DNI",
        numDoc: "12345678",
        email: "juan@example.com",
        telefono: "1122334455",
        fechaRegistro: "2023-05-15"
      },
      {
        id: 2,
        nombre: "Laura",
        apellido: "Gómez",
        tipoDoc: "Cédula",
        numDoc: "87654321",
        email: "laura@example.com",
        telefono: "5544332211",
        fechaRegistro: "2023-04-10"
      }
    ]);
  }, []);

  const handleEliminar = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar este usuario?");
    if (confirmacion) {
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
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
      telefono: usuario.telefono
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
      telefono: ""
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
      telefono: ""
    });
    setEditandoId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, apellido, tipoDoc, numDoc, email, telefono } = nuevoUsuario;

    if (nombre && apellido && tipoDoc && numDoc && email && telefono) {
      if (editandoId) {
        
        setUsuarios(usuarios.map(usuario => 
          usuario.id === editandoId ? { 
            ...usuario,
            ...nuevoUsuario
          } : usuario
        ));
      } else {
        
        const nuevo = {
          id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
          nombre,
          apellido,
          tipoDoc,
          numDoc,
          email,
          telefono,
          fechaRegistro: new Date().toISOString().split("T")[0]
        };
        setUsuarios([...usuarios, nuevo]);
      }
      
      
      setNuevoUsuario({
        nombre: "",
        apellido: "",
        tipoDoc: "DNI",
        numDoc: "",
        email: "",
        telefono: ""
      });
      setMostrarFormulario(false);
      setEditandoId(null);
    } else {
      alert("Todos los campos son obligatorios.");
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

          <div className="acciones-superiores">
            <button className="btn-agregar" onClick={handleAgregar}>
              <FontAwesomeIcon icon={faPlus} /> Nuevo Usuario
            </button>
            <button className="btn-reiniciar" onClick={() => setBusqueda("")}>
              Limpiar Búsqueda
            </button>
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
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Apellido</label>
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={nuevoUsuario.apellido}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellido: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Documento</label>
                  <select
                    value={nuevoUsuario.tipoDoc}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, tipoDoc: e.target.value })}
                    required
                  >
                    <option value="DNI">DNI</option>
                    <option value="Cédula">Cédula</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Número de Documento</label>
                  <input
                    type="text"
                    placeholder="Número de documento"
                    value={nuevoUsuario.numDoc}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, numDoc: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={nuevoUsuario.email}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    placeholder="Número de teléfono"
                    value={nuevoUsuario.telefono}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, telefono: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="form-buttons">
                <button type="submit" className="btn-guardar">
                  <FontAwesomeIcon icon={editandoId ? faSave : faPlus} /> 
                  {editandoId ? " Guardar Cambios" : " Registrar Usuario"}
                </button>
                <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                  <FontAwesomeIcon icon={faTimes} /> Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="busqueda-container">
            <input
              type="text"
              placeholder="Buscar Usuario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} className="icono-busqueda" />
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Tipo Doc.</th>
                <th>Número Doc.</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.tipoDoc}</td>
                  <td>{usuario.numDoc}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.telefono}</td>
                  <td>{usuario.fechaRegistro}</td>
                  <td>
                    <button 
                      className="btn-editar" 
                      onClick={() => handleEditar(usuario)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      className="btn-eliminar" 
                      onClick={() => handleEliminar(usuario.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="9">No se encontraron usuarios.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Usuarios;






