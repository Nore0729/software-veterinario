import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, Search, X } from "lucide-react";
import "../../styles/Administrador/ServiciosAdmin.css";
import AdminLayout from "../../layout/AdminLayout";

function ServiciosAdmin() {
  // Estados para manejar los campos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
  });

  const [isFormVisible, setIsFormVisible] = useState(true);

  const [servicios, setServicios] = useState([]);

  // Cargar los servicios desde la API
  useEffect(() => {
    const obtenerServicios = async () => {
      try {
        const res = await fetch("/api/obtener_servicios");
        if (!res.ok) {
          throw new Error("Error al obtener los servicios");
        }
        const data = await res.json();
        setServicios(data); 
      } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al cargar los servicios");
      }
    };

    obtenerServicios();
  }, []); 

  // Función para eliminar un servicio
  const handleEliminar = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar este servicio?");
    if (!confirmacion) return; // Si el usuario no confirma, no hacemos nada

    try {
      const res = await fetch(`/api/servicios/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message); // Muestra un mensaje de éxito

        // Eliminar el servicio de la lista
        setServicios(servicios.filter(servicio => servicio.id !== id));
      } else {
        alert(data.error || "No se pudo eliminar el servicio");
      }
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
      alert("Hubo un problema al eliminar el servicio");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, descripcion, precio, duracion } = formData;
    if (!nombre || !descripcion || !precio || !duracion) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const dataToSend = {
      nombre,
      descripcion,
      precio,
      duracion_estimada: duracion,
    };

    try {
      //la API para agregar el nuevo servicio
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

      // Limpiar el formulario después de registrar el servicio
      setFormData({ nombre: "", descripcion: "", precio: "", duracion: "" });

    } catch (error) {
      console.error("Error al registrar el servicio:", error);
      alert("Hubo un problema al registrar el servicio");
    }
  };

  // Función para limpiar el formulario (funcionalidad de cancelar)
  const handleCancelar = () => {
    setFormData({ nombre: "", descripcion: "", precio: "", duracion: "" });
    setIsFormVisible(false); 
  };

  const handleAgregarServicio = () => {
    setIsFormVisible(true); 
  };

  return (
    <AdminLayout>
      <div className="servicios-admin-container">
        <h1 className="servicios-titulo">Administración de Servicios Veterinarios</h1>

        {/* Botón para mostrar el formulario de agregar servicio */}
        {!isFormVisible && (
          <button 
            className="btn-primary btn-corto" 
            onClick={handleAgregarServicio} 
            style={{ width: '160px',height:'68px' ,display: 'block', marginLeft: 'auto', padding: '20px', marginBottom: '20px' }} 
          >
            <PlusCircle size={18} /> Agregar Servicio
          </button>
        )}

        {isFormVisible && (
          <div className="servicios-form-container">
            <h2>Agregar nuevo Servicio</h2>
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
                <button type="button" className="btn-primary" style={{ background: '#F08080' }} onClick={handleCancelar}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

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
                      <td>{servicio.duracion_estimada} min</td>
                      <td className="actions-cell">
                        <button className="btn-editar" title="Editar">
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn-eliminar" 
                          title="Eliminar" 
                          onClick={() => handleEliminar(servicio.id)} // Llamada a la función eliminar
                        >
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
