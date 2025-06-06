import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, Search, X } from "lucide-react";
import "../../styles/Administrador/ServiciosAdmin.css"
import AdminLayout from "../../layout/AdminLayout";

function ServiciosAdmin() {
  // Estado para los servicios
  const [servicios, setServicios] = useState([
    { id: 1, nombre: "Consulta general", descripcion: "Revisión médica básica", precio: 50, duracion: 30 },
    { id: 2, nombre: "Vacunación", descripcion: "Aplicación de vacunas", precio: 80, duracion: 20 },
    { id: 3, nombre: "Cirugía menor", descripcion: "Intervenciones quirúrgicas simples", precio: 200, duracion: 60 },
  ]);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: ""
  });

  // Estado para edición
  const [editando, setEditando] = useState(false);
  const [idActual, setIdActual] = useState(null);
  
  // Estado para búsqueda
  const [busqueda, setBusqueda] = useState("");
  const [serviciosFiltrados, setServiciosFiltrados] = useState([]);

  // Filtrar servicios
  useEffect(() => {
    if (busqueda === "") {
      setServiciosFiltrados(servicios);
    } else {
      const filtrados = servicios.filter(servicio =>
        servicio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        servicio.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      );
      setServiciosFiltrados(filtrados);
    }
  }, [busqueda, servicios]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editando) {
      // Actualizar servicio existente
      setServicios(servicios.map(servicio =>
        servicio.id === idActual ? { ...formData, id: idActual } : servicio
      ));
    } else {
      // Agregar nuevo servicio
      const nuevoId = servicios.length > 0 ? Math.max(...servicios.map(s => s.id)) + 1 : 1;
      setServicios([...servicios, { ...formData, id: nuevoId }]);
    }
    
    // Limpiar formulario
    setFormData({ nombre: "", descripcion: "", precio: "", duracion_estimada: "" });
    setEditando(false);
    setIdActual(null);
  };

  // Editar servicio
  const handleEditar = (servicio) => {
    setFormData({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio,
      duracion_estimada: servicio.duracion_estimada
    });
    setEditando(true);
    setIdActual(servicio.id);
  };

  // Eliminar servicio
  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      setServicios(servicios.filter(servicio => servicio.id !== id));
    }
  };

  // Cancelar edición
  const handleCancelar = () => {
    setFormData({ nombre: "", descripcion: "", precio: "", duracion: "" });
    setEditando(false);
    setIdActual(null);
  };

  return (
    <AdminLayout>
    <div className="servicios-admin-container">
      <h1 className="servicios-titulo">Administración de Servicios Veterinarios</h1>
      
      {/* Formulario para agregar/editar servicios */}
      <div className="servicios-form-container">
        <h2>{editando ? "Editar Servicio" : "Agregar Nuevo Servicio"}</h2>
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
                name="duracion_estimada"
                value={formData.duracion_estimada}
                onChange={handleChange}
                min="5"
                required
              />
            </div>
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editando ? "Actualizar Servicio" : "Agregar Servicio"}
            </button>
            {editando && (
              <button type="button" onClick={handleCancelar} className="btn-cancelar">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Búsqueda y lista de servicios */}
      <div className="servicios-list-container">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <X className="clear-search" onClick={() => setBusqueda("")} />
          )}
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
              {serviciosFiltrados.length > 0 ? (
                serviciosFiltrados.map(servicio => (
                  <tr key={servicio.id}>
                    <td>{servicio.nombre}</td>
                    <td>{servicio.descripcion}</td>
                    <td>${servicio.precio}</td>
                    <td>{servicio.duracion} min</td>
                    <td className="actions-cell">
                      <button 
                        onClick={() => handleEditar(servicio)} 
                        className="btn-editar"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleEliminar(servicio.id)} 
                        className="btn-eliminar"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">
                    {busqueda ? "No se encontraron servicios" : "No hay servicios registrados"}
                  </td>
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