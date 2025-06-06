import { useState, useEffect} from "react";
import AdminLayout from "../../layout/AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen , faEdit, faTrash, faToggleOn, faToggleOff, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../styles/Administrador/Roles.css";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [mostrarFormularioRol, setMostrarFormularioRol] = useState(false);
  const [nuevoRol, setNuevoRol] = useState({
    nom_rol: "",
    descripcion: ""
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [rolEditando, setRolEditando] = useState(null);
  const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: "", tipo: "" });

 
  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    try {
      const response = await fetch("/api/obtener_roles");
      if (!response.ok) throw new Error("Error al cargar roles");
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error:", error);
      mostrarNotificacion("Error al cargar los roles", "error");
    }
  };


  const mostrarNotificacion = (mensaje, tipo) => {
    setNotificacion({ mostrar: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ mostrar: false, mensaje: "", tipo: "" }), 3000);
  };

  // Manejar cambios en el formulario
  const handleRolChange = (e) => {
    const { name, value } = e.target;
    setNuevoRol({ ...nuevoRol, [name]: value });
  };

  // Cancelar creación/edición
  const handleCancelarRol = () => {
    setMostrarFormularioRol(false);
    setModoEdicion(false);
    setNuevoRol({ nom_rol: "", descripcion: "" });
    setRolEditando(null);
  };

  // Guardar rol (crear o actualizar)
  const handleGuardarRol = async (e) => {
    e.preventDefault();
    
    if (!nuevoRol.nom_rol || !nuevoRol.descripcion) {
      mostrarNotificacion("Nombre y descripción son obligatorios", "error");
      return;
    }

    try {
      const url = modoEdicion ? `/api/roles/${rolEditando.id}` : "/api/roles";
      const method = modoEdicion ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoRol)
      });
      
      if (!response.ok) throw new Error(`Error al ${modoEdicion ? 'actualizar' : 'crear'} el rol`);
      
      const data = await response.json();
      
      if (modoEdicion) {
        setRoles(roles.map(rol => rol.id === rolEditando.id ? data : rol));
        mostrarNotificacion("Rol actualizado correctamente", "exito");
      } else {
        setRoles([data, ...roles]); // Agrega el nuevo rol al principio
        mostrarNotificacion("Rol creado correctamente", "exito");
      }
      
      handleCancelarRol();
    } catch (error) {
      console.error("Error:", error);
      mostrarNotificacion(error.message || "Error del servidor", "error");
    }
  };

  // Editar rol
  const handleEditarRol = (rol) => {
    setRolEditando(rol);
    setNuevoRol({
      nom_rol: rol.nom_rol,
      descripcion: rol.descripcion
    });
    setModoEdicion(true);
    setMostrarFormularioRol(true);
  };

  // Eliminar rol
  const handleEliminarRol = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este rol?")) return;
    
    try {
      const response = await fetch(`/api/roles/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar el rol");
      
      setRoles(roles.filter(rol => rol.id !== id));
      mostrarNotificacion("Rol eliminado correctamente", "exito");
    } catch (error) {
      console.error("Error:", error);
      mostrarNotificacion(error.message || "Error del servidor", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-container">
        <main className="admin-main">
          <div className="roles-container">
            <h1>Gestión de Roles</h1>

            {notificacion.mostrar && (
              <div className={`notificacion ${notificacion.tipo}`}>
                <FontAwesomeIcon icon={notificacion.tipo === "exito" ? faCheck : faTimes} />
                {notificacion.mensaje}
              </div>
            )}

            <div className="seccion-roles">
              <div className="header-roles">
                <h2>Administrar Roles</h2>
                <button 
                  onClick={() => {
                    setMostrarFormularioRol(true);
                    setModoEdicion(false);
                  }}
                  className="btn-nuevo-rol"
                >
                  <FontAwesomeIcon icon={faPlus} /> Crear Nuevo Rol
                </button>
              </div>

              {mostrarFormularioRol && (
                <form onSubmit={handleGuardarRol} className="form-rol">
                  <h3>{modoEdicion ? "Editar Rol" : "Crear Nuevo Rol"}</h3>
                  
                  <div className="form-group">
                    <label>Nombre del Rol:</label>
                    <input
                      type="text"
                      name="nom_rol"
                      value={nuevoRol.nom_rol}
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
                  
                  <div className="form-buttons">
                    <button type="submit" className="btn-guardar">
                      {modoEdicion ? "Actualizar Rol" : "Crear Rol"}
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
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length > 0 ? (
                    roles.map(rol => (
                      <tr key={rol.id}>
                        <td>{rol.id}</td>
                        <td>{rol.nom_rol}</td>
                        <td>{rol.descripcion}</td>
                        <td className="acciones">
                          <button onClick={() => handleEditarRol(rol)} className="btn-editar">
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button onClick={() => handleEliminarRol(rol.id)} className="btn-eliminar">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="sin-datos">No hay roles registrados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}

export default Roles;