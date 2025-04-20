import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faToggleOn, faToggleOff, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../Estilos_F/Roles.css";
import "../Estilos_F/Administrador.css";

function Roles() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Juan Pérez", email: "juan@example.com", rolActual: "Veterinario" },
    { id: 2, nombre: "María Gómez", email: "maria@example.com", rolActual: "Administrador" },
    { id: 3, nombre: "Carlos Ruiz", email: "carlos@example.com", rolActual: "Invitado" }
  ]);

  const [roles, setRoles] = useState([
    { id: 1, nombre: "Admin", descripcion: "Acceso completo al sistema", estado: true },
    { id: 2, nombre: "Veterinario", descripcion: "Acceso a historias médicas y tratamientos", estado: true },
    { id: 4, nombre: "Invitado", descripcion: "Acceso limitado a funciones básicas", estado: true }
  ]);

  const [asignacion, setAsignacion] = useState({
    usuarioId: "",
    rolId: ""
  });

  const [mostrarFormularioRol, setMostrarFormularioRol] = useState(false);
  const [editandoRolId, setEditandoRolId] = useState(null);
  const [nuevoRol, setNuevoRol] = useState({
    nombre: "",
    descripcion: "",
    estado: true
  });

  const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const mostrarNotificacion = (mensaje, tipo) => {
    setNotificacion({ mostrar: true, mensaje, tipo });
    setTimeout(() => {
      setNotificacion({ mostrar: false, mensaje: "", tipo: "" });
    }, 3000);
  };

  const handleAsignacionChange = (e) => {
    const { name, value } = e.target;
    setAsignacion({ ...asignacion, [name]: value });
  };

  const handleAsignarRol = (e) => {
    e.preventDefault();
    
    if (!asignacion.usuarioId || !asignacion.rolId) {
      mostrarNotificacion("Debe seleccionar un usuario y un rol", "error");
      return;
    }

    const rolSeleccionado = roles.find(rol => rol.id === parseInt(asignacion.rolId));
    
    setUsuarios(usuarios.map(usuario => 
      usuario.id === parseInt(asignacion.usuarioId) 
        ? { ...usuario, rolActual: rolSeleccionado.nombre } 
        : usuario
    ));

    mostrarNotificacion(`Rol asignado correctamente a ${usuarios.find(u => u.id === parseInt(asignacion.usuarioId)).nombre}`, "exito");
    setAsignacion({ usuarioId: "", rolId: "" });
  };

  const handleRolChange = (e) => {
    const { name, value } = e.target;
    setNuevoRol({ ...nuevoRol, [name]: value });
  };

  const handleEditarRol = (rol) => {
    setEditandoRolId(rol.id);
    setNuevoRol({ nombre: rol.nombre, descripcion: rol.descripcion, estado: rol.estado });
    setMostrarFormularioRol(true);
  };

  const handleCancelarRol = () => {
    setMostrarFormularioRol(false);
    setNuevoRol({ nombre: "", descripcion: "", estado: true });
    setEditandoRolId(null);
  };

  const handleGuardarRol = (e) => {
    e.preventDefault();
    
    if (!nuevoRol.nombre || !nuevoRol.descripcion) {
      mostrarNotificacion("Nombre y descripción son obligatorios", "error");
      return;
    }

    if (editandoRolId) {
      setRoles(roles.map(rol => 
        rol.id === editandoRolId 
          ? { ...rol, ...nuevoRol } 
          : rol
      ));
      mostrarNotificacion("Rol actualizado correctamente", "exito");
    } else {
      const nuevoId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
      setRoles([...roles, { ...nuevoRol, id: nuevoId }]);
      mostrarNotificacion("Rol creado correctamente", "exito");
    }

    handleCancelarRol();
  };

  const handleToggleEstado = (id) => {
    setRoles(roles.map(rol => 
      rol.id === id 
        ? { ...rol, estado: !rol.estado } 
        : rol
    ));
    mostrarNotificacion(`Rol ${roles.find(r => r.id === id).estado ? "desactivado" : "activado"} correctamente`, "exito");
  };

  const handleEliminarRol = (id) => {
    const rolAEliminar = roles.find(r => r.id === id);
    const usuariosConRol = usuarios.filter(u => u.rolActual === rolAEliminar.nombre);

    if (usuariosConRol.length > 0) {
      mostrarNotificacion(`No se puede eliminar, hay ${usuariosConRol.length} usuario(s) con este rol`, "error");
      return;
    }

    const confirmacion = window.confirm(`¿Estás seguro de eliminar el rol "${rolAEliminar.nombre}"?`);
    if (confirmacion) {
      setRoles(roles.filter(rol => rol.id !== id));
      mostrarNotificacion("Rol eliminado correctamente", "exito");
    }
  };

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
          <li><a href="/usuarios-y-roles">Usuarios y Roles</a></li>
        </ul>
      </nav>

      <main className="admin-main">
        <div className="roles-container">
          <h1>Gestión de Roles</h1>

          {notificacion.mostrar && (
            <div className={`notificacion ${notificacion.tipo}`}>
              <FontAwesomeIcon icon={notificacion.tipo === "exito" ? faCheck : faTimes} />
              {notificacion.mensaje}
            </div>
          )}

          <div className="seccion-asignacion">
            <h2>Asignar Rol a Usuario</h2>
            <form onSubmit={handleAsignarRol} className="form-asignacion">
              <div className="form-group">
                <select
                  name="usuarioId"
                  value={asignacion.usuarioId}
                  onChange={handleAsignacionChange}
                  required
                >
                  <option value="">Seleccione un usuario</option>
                  {usuarios.map(usuario => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre} ({usuario.email}) - Rol actual: {usuario.rolActual}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <select
                  name="rolId"
                  value={asignacion.rolId}
                  onChange={handleAsignacionChange}
                  required
                >
                  <option value="">Seleccione un rol</option>
                  {roles.filter(rol => rol.estado).map(rol => (
                    <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                  ))}
                </select>
              </div>
              
              <button type="submit" className="btn-asignar">
                <FontAwesomeIcon icon={faPlus} /> Asignar
              </button>
            </form>
          </div>

          <div className="seccion-roles">
            <div className="header-roles">
              <h2>Lista de Roles</h2>
              <button 
                onClick={() => setMostrarFormularioRol(true)} 
                className="btn-nuevo-rol"
              >
                <FontAwesomeIcon icon={faPlus} /> Nuevo Rol
              </button>
            </div>

            {mostrarFormularioRol && (
              <form onSubmit={handleGuardarRol} className="form-rol">
                <h3>{editandoRolId ? "Editar Rol" : "Crear Nuevo Rol"}</h3>
                
                <div className="form-group">
                  <label>Nombre del Rol:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={nuevoRol.nombre}
                    onChange={handleRolChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Descripción:</label>
                  <textarea
                    name="descripcion"
                    value={nuevoRol.descripcion}
                    onChange={handleRolChange}
                    required
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="estado"
                      checked={nuevoRol.estado}
                      onChange={(e) => setNuevoRol({ ...nuevoRol, estado: e.target.checked })}
                    />
                    Activo
                  </label>
                </div>
                
                <div className="form-buttons">
                  <button type="submit" className="btn-guardar">
                    {editandoRolId ? "Guardar Cambios" : "Crear Rol"}
                  </button>
                  <button type="button" className="btn-cancelar" onClick={handleCancelarRol}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <table className="tabla-roles">
              <thead>
                <tr>
                  <th>Rol</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {roles.map(rol => (
                  <tr key={rol.id}>
                    <td>{rol.nombre}</td>
                    <td>{rol.descripcion}</td>
                    <td>
                      <span className={`estado ${rol.estado ? 'activo' : 'inactivo'}`}>
                        {rol.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="acciones">
                      <button onClick={() => handleEditarRol(rol)} className="btn-editar">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => handleEliminarRol(rol.id)} className="btn-eliminar">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button 
                        onClick={() => handleToggleEstado(rol.id)} 
                        className={`btn-toggle ${rol.estado ? 'activo' : 'inactivo'}`}
                      >
                        <FontAwesomeIcon icon={rol.estado ? faToggleOn : faToggleOff} />
                        {rol.estado ? ' Desactivar' : ' Activar'}
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
}

export default Roles;
