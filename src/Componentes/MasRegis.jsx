import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../Estilos_F/MasRegis.css";
import "../Estilos_F/Administrador.css";

function Mascotas() {
  const [mascotas, setMascotas] = useState([
    {
      id: 1,
      nombre: "Luna",
      especie: "Gato",
      raza: "Persa",
      idDueno: "12345",
      foto: "https://placekitten.com/200/200",
      genero: "hembra",
      color: "Blanco",
      fechaNacimiento: "2020-05-15",
      peso: "3.5",
      estadoReproductivo: "esterilizado",
      caracteristicasFisicas: "Ojos azules, pelo largo"
    },
    {
      id: 2,
      nombre: "Max",
      especie: "Perro",
      raza: "Labrador",
      idDueno: "98765",
      foto: "https://placedog.net/400/400",
      genero: "macho",
      color: "Negro",
      fechaNacimiento: "2019-08-10",
      peso: "25.0",
      estadoReproductivo: "intacto",
      caracteristicasFisicas: "Collar rojo, cicatriz en oreja derecha"
    }
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [mascotaEditada, setMascotaEditada] = useState({
    nombre: "",
    especie: "",
    raza: "",
    idDueno: "",
    foto: "",
    genero: "",
    color: "",
    fechaNacimiento: "",
    peso: "",
    estadoReproductivo: "",
    caracteristicasFisicas: ""
  });
  const [busqueda, setBusqueda] = useState("");
  const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const mascotasFiltradas = mascotas.filter(mascota => {
    const termino = busqueda.toLowerCase();
    return (
      mascota.nombre.toLowerCase().includes(termino) ||
      mascota.especie.toLowerCase().includes(termino) ||
      mascota.raza.toLowerCase().includes(termino) ||
      mascota.idDueno.toLowerCase().includes(termino) ||
      mascota.color.toLowerCase().includes(termino)
    );
  });

  const mostrarNotificacion = (mensaje, tipo) => {
    setNotificacion({ mostrar: true, mensaje, tipo });
    setTimeout(() => {
      setNotificacion({ mostrar: false, mensaje: "", tipo: "" });
    }, 3000);
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const handleEditar = (mascota) => {
    setEditandoId(mascota.id);
    setMascotaEditada({ ...mascota });
    setMostrarFormulario(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setMascotaEditada({ ...mascotaEditada, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMascotaEditada({ ...mascotaEditada, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setMascotaEditada({
      nombre: "",
      especie: "",
      raza: "",
      idDueno: "",
      foto: "",
      genero: "",
      color: "",
      fechaNacimiento: "",
      peso: "",
      estadoReproductivo: "",
      caracteristicasFisicas: ""
    });
    setEditandoId(null);
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    
    if (!mascotaEditada.nombre || !mascotaEditada.especie || !mascotaEditada.idDueno) {
      mostrarNotificacion("Nombre, especie e ID del dueño son obligatorios", "error");
      return;
    }

    setMascotas(mascotas.map(mascota => 
      mascota.id === editandoId ? { ...mascotaEditada, id: editandoId } : mascota
    ));
    
    mostrarNotificacion("Mascota actualizada correctamente", "exito");
    handleCancelar();
  };

  const handleEliminar = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar esta mascota?");
    if (confirmacion) {
      setMascotas(mascotas.filter(mascota => mascota.id !== id));
      mostrarNotificacion("Mascota eliminada correctamente", "exito");
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "No especificada";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
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
        <div className="mascotas-container">
          <h1>Mascotas Registradas</h1>

          {notificacion.mostrar && (
            <div className={`notificacion ${notificacion.tipo}`}>
              <FontAwesomeIcon icon={notificacion.tipo === "exito" ? faCheck : faTimes} />
              {notificacion.mensaje}
            </div>
          )}

          <div className="busqueda-container">
            <input
              type="text"
              placeholder="Buscar mascotas por nombre, especie, raza, ID dueño o color..."
              value={busqueda}
              onChange={handleBusquedaChange}
            />
            <FontAwesomeIcon icon={faSearch} className="icono-busqueda" />
          </div>

          {mostrarFormulario && (
            <form className="formulario-mascota" onSubmit={handleGuardar}>
              <h2>Editar Mascota</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={mascotaEditada.nombre}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Especie:</label>
                  <input
                    type="text"
                    name="especie"
                    value={mascotaEditada.especie}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Raza:</label>
                  <input
                    type="text"
                    name="raza"
                    value={mascotaEditada.raza}
                    onChange={handleEditChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>ID del Dueño:</label>
                  <input
                    type="text"
                    name="idDueno"
                    value={mascotaEditada.idDueno}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Género:</label>
                  <select
                    name="genero"
                    value={mascotaEditada.genero}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Color:</label>
                  <input
                    type="text"
                    name="color"
                    value={mascotaEditada.color}
                    onChange={handleEditChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Nacimiento:</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={mascotaEditada.fechaNacimiento}
                    onChange={handleEditChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Peso (kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    name="peso"
                    value={mascotaEditada.peso}
                    onChange={handleEditChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Estado Reproductivo:</label>
                  <select
                    name="estadoReproductivo"
                    value={mascotaEditada.estadoReproductivo}
                    onChange={handleEditChange}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="intacto">Intacto</option>
                    <option value="esterilizado">Esterilizado</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Características Físicas:</label>
                <textarea
                  name="caracteristicasFisicas"
                  value={mascotaEditada.caracteristicasFisicas}
                  onChange={handleEditChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Foto:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {mascotaEditada.foto && (
                  <img 
                    src={mascotaEditada.foto} 
                    alt="Previsualización" 
                    className="preview-image"
                  />
                )}
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn-guardar">
                  Guardar Cambios
                </button>
                <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="table-container">
            <table className="mascotas-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>Especie</th>
                  <th>Raza</th>
                  <th>Género</th>
                  <th>Color</th>
                  <th>Fecha Nac.</th>
                  <th>Peso (kg)</th>
                  <th>Estado Reprod.</th>
                  <th>ID Dueño</th>
                  <th>Características</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mascotasFiltradas.map((mascota) => (
                  <tr key={mascota.id}>
                    <td>
                      <img 
                        src={mascota.foto || "https://via.placeholder.com/50?text=Sin+imagen"} 
                        alt={mascota.nombre}
                        className="mascota-imagen-tabla"
                      />
                    </td>
                    <td>{mascota.nombre}</td>
                    <td>{mascota.especie}</td>
                    <td>{mascota.raza || "-"}</td>
                    <td>{mascota.genero === 'macho' ? 'Macho' : 'Hembra'}</td>
                    <td>{mascota.color || "-"}</td>
                    <td>{formatFecha(mascota.fechaNacimiento)}</td>
                    <td>{mascota.peso || "-"}</td>
                    <td>{mascota.estadoReproductivo === 'intacto' ? 'Intacto' : 'Esterilizado'}</td>
                    <td>{mascota.idDueno}</td>
                    <td className="caracteristicas-cell">
                      {mascota.caracteristicasFisicas || "-"}
                    </td>
                    <td className="acciones-cell">
                      <button onClick={() => handleEditar(mascota)} className="btn-editar">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => handleEliminar(mascota.id)} className="btn-eliminar">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mascotasFiltradas.length === 0 && (
            <p className="sin-mascotas">
              {busqueda ? "No se encontraron mascotas con ese criterio" : "No hay mascotas registradas"}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Mascotas;