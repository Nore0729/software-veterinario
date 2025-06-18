import { useState } from "react";
import { PlusCircle, Edit, Trash2, Search, X } from "lucide-react";
import "../../styles/Administrador/ServiciosAdmin.css"
import AdminLayout from "../../layout/AdminLayout";

function ServiciosAdmin() {
  // Estados para manejar los campos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
  });

  const [servicios, setServicios] = useState([
    { id: 1, nombre: "Consulta general", descripcion: "Revisión médica básica", precio: 50, duracion: 30 },
  ]);

  // Manejar el cambio de los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, descripcion, precio, duracion } = formData;

    // Validar que todos los campos estén llenos
    if (!nombre || !descripcion || !precio || !duracion) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const dataToSend = {
      nombre,
      descripcion,
      precio,
      duracion_estimada: duracion, // Asegúrate de que la API usa este nombre
    };

    try {
      // Llamar a la API para agregar el nuevo servicio
      const res = await fetch("/api/servicios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al registrar el servicio");
      }

      const result = await res.json();
      alert(result.message); // Muestra el mensaje de éxito

      // Actualizar la lista de servicios (aquí agregamos el nuevo servicio al estado)
      setServicios((prevServicios) => [
        ...prevServicios,
        { id: prevServicios.length + 1, ...formData },
      ]);

      // Limpiar el formulario
      setFormData({ nombre: "", descripcion: "", precio: "", duracion: "" });
    } catch (error) {
      console.error("Error al registrar el servicio:", error);
      alert("Hubo un problema al registrar el servicio");
    }
  };

  return (
    <AdminLayout>
      <div className="servicios-admin-container">
        <h1 className="servicios-titulo">Administración de Servicios Veterinarios</h1>

        {/* Formulario para agregar un nuevo servicio */}
        <div className="servicios-form-container">
          <h2>Agregar Nuevo Servicio</h2>
          <form onSubmit={handleSubmit} className="servicios-form">
            <div className="form-group">
              <label>Nombre del Servicio</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Precio ($)</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Duración (min)</label>
                <input
                  type="number"
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleChange}
                  min="5"
                  required
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-primary">Agregar Servicio</button>
            </div>
          </form>
        </div>

        {/* Búsqueda y lista de servicios */}
        <div className="servicios-list-container">
          <div className="search-container">
            <Search className="search-icon" />
            <input type="text" placeholder="Buscar servicios..." />
            <X className="clear-search" />
          </div>

          <div className="servicios-table-container">
            <table className="servicios-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Duración</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {servicios.length > 0 ? (
                  servicios.map(servicio => (
                    <tr key={servicio.id}>
                      <td>{servicio.nombre}</td>
                      <td>{servicio.descripcion}</td>
                      <td>${servicio.precio}</td>
                      <td>{servicio.duracion} min</td>
                      <td className="actions-cell">
                        <button className="btn-editar" title="Editar">
                          <Edit size={16} />
                        </button>
                        <button className="btn-eliminar" title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-results">No hay servicios registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ServiciosAdmin;
