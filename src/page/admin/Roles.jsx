import { useState, useEffect } from "react";
import MenuAdmin from "./MenuAdmin"; // Asegúrate que la ruta a MenuAdmin sea correcta
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../styles/Administrador/Roles.css"; // Asegúrate que la ruta al CSS sea correcta

// Definimos la URL base de tu API en un solo lugar.
const API_BASE_URL = "http://localhost:3000";

function Roles() {
  // --- ESTADOS DEL COMPONENTE ---
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para el formulario
  const [mostrarFormularioRol, setMostrarFormularioRol] = useState(false);
  const [nuevoRol, setNuevoRol] = useState({ nom_rol: "", descripcion: "" });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [rolEditando, setRolEditando] = useState(null);

  // Estado para las notificaciones
  const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: "", tipo: "" });

  // --- EFECTO PARA CARGAR DATOS INICIALES ---
  useEffect(() => {
    cargarRoles();
  }, []);

  // --- FUNCIONES DE API (CRUD) ---

  const cargarRoles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/roles`);
      if (!response.ok) {
        throw new Error("No se pudieron cargar los roles desde el servidor.");
      }
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error en cargarRoles:", error);
      mostrarNotificacion(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuardarRol = async (e) => {
    e.preventDefault();
    if (!nuevoRol.nom_rol || !nuevoRol.descripcion) {
      mostrarNotificacion("Nombre y descripción son obligatorios", "error");
      return;
    }
    
    setIsSaving(true);
    const url = modoEdicion
      ? `${API_BASE_URL}/api/admin/roles/${rolEditando.id}`
      : `${API_BASE_URL}/api/admin/roles`;
    const method = modoEdicion ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoRol)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Error al ${modoEdicion ? 'actualizar' : 'crear'} el rol`);
      }
      
      if (modoEdicion) {
        setRoles(roles.map(rol => (rol.id === rolEditando.id ? { ...rol, ...nuevoRol } : rol)));
        mostrarNotificacion("Rol actualizado correctamente", "exito");
      } else {
        setRoles([data, ...roles]);
        mostrarNotificacion("Rol creado correctamente", "exito");
      }
      handleCancelarRol();
    } catch (error) {
      console.error("Error en handleGuardarRol:", error);
      mostrarNotificacion(error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEliminarRol = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este rol?")) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/roles/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar el rol");
      }
      setRoles(roles.filter(rol => rol.id !== id));
      mostrarNotificacion("Rol eliminado correctamente", "exito");
    } catch (error) {
      console.error("Error en handleEliminarRol:", error);
      mostrarNotificacion(error.message, "error");
    }
  };

  // --- FUNCIONES DE MANEJO DEL FORMULARIO Y NOTIFICACIONES ---

  const handleRolChange = (e) => {
    const { name, value } = e.target;
    setNuevoRol(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditarRol = (rol) => {
    setModoEdicion(true);
    setRolEditando(rol);
    setNuevoRol({ nom_rol: rol.nom_rol, descripcion: rol.descripcion });
    setMostrarFormularioRol(true);
  };

  const handleCrearNuevoRol = () => {
    setModoEdicion(false);
    setRolEditando(null);
    setNuevoRol({ nom_rol: "", descripcion: "" });
    setMostrarFormularioRol(true);
  };

  const handleCancelarRol = () => {
    setMostrarFormularioRol(false);
    setModoEdicion(false);
    setNuevoRol({ nom_rol: "", descripcion: "" });
    setRolEditando(null);
  };
  
  const mostrarNotificacion = (mensaje, tipo) => {
    setNotificacion({ mostrar: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ mostrar: false, mensaje: "", tipo: "" }), 3000);
  };

  // --- RENDERIZADO DEL COMPONENTE ---

  if (isLoading) {
    return (
      <MenuAdmin>
        <div className="admin-container"><h1>Cargando roles...</h1></div>
      </MenuAdmin>
    );
  }
  
  return (
    <MenuAdmin>
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
                {!mostrarFormularioRol && (
                  <button onClick={handleCrearNuevoRol} className="btn-nuevo-rol">
                    <FontAwesomeIcon icon={faPlus} /> Crear Nuevo Rol
                  </button>
                )}
              </div>

              {mostrarFormularioRol && (
                <form onSubmit={handleGuardarRol} className="form-rol">
                  <h3>{modoEdicion ? "Editar Rol" : "Crear Nuevo Rol"}</h3>
                  <div className="form-group">
                    <label>Nombre del Rol:</label>
                    <input type="text" name="nom_rol" value={nuevoRol.nom_rol} onChange={handleRolChange} required />
                  </div>
                  <div className="form-group">
                    <label>Descripción:</label>
                    <textarea name="descripcion" value={nuevoRol.descripcion} onChange={handleRolChange} required rows="3" />
                  </div>
                  <div className="form-buttons">
                    <button type="submit" className="btn-guardar" disabled={isSaving}>
                      {isSaving ? 'Guardando...' : (modoEdicion ? 'Actualizar Rol' : 'Crear Rol')}
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
                          <button onClick={() => handleEditarRol(rol)} className="btn-editar" title="Editar">
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button onClick={() => handleEliminarRol(rol.id)} className="btn-eliminar" title="Eliminar">
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
    </MenuAdmin>
  );
}

export default Roles;