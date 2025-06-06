import AdminLayout from "../Administrador/AdminLayout";
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faEdit, faTrash, faSearch, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"
import "../../Estilos_F/Administrador/Veterinarios.css"

function Veterinarios() {
  const [veterinarios, setVeterinarios] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [especialidadFiltro, setEspecialidadFiltro] = useState("")
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [nuevoVeterinario, setNuevoVeterinario] = useState({
    nombre: "",
    especialidad: "",
    email: "",
    telefono: "",
    foto: "",
  })
  const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: "", tipo: "" })

  useEffect(() => {
    setVeterinarios([
      {
        id: 1,
        nombre: "Dra. Martínez",
        especialidad: "Cirugía",
        email: "martinez@vetclinic.com",
        telefono: "555-123-4567",
        foto: "",
      },
      {
        id: 2,
        nombre: "Dr. Gómez",
        especialidad: "Dermatología",
        email: "gomez@vetclinic.com",
        telefono: "555-234-5678",
        foto: " ",
      },
      {
        id: 3,
        nombre: "Dra. Fernández",
        especialidad: "Odontología",
        email: "fernandez@vetclinic.com",
        telefono: "555-345-6789",
        foto: " ",
      },
      {
        id: 4,
        nombre: "Dr. Ramírez",
        especialidad: "Medicina interna",
        email: "ramirez@vetclinic.com",
        telefono: "555-456-7890",
        foto: " ",
      },
    ])
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setNuevoVeterinario({ ...nuevoVeterinario, [name]: value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNuevoVeterinario({ ...nuevoVeterinario, foto: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const mostrarNotificacion = (mensaje, tipo) => {
    setNotificacion({ mostrar: true, mensaje, tipo })
    setTimeout(() => {
      setNotificacion({ mostrar: false, mensaje: "", tipo: "" })
    }, 3000)
  }

  const handleAgregar = () => {
    setEditandoId(null)
    setNuevoVeterinario({
      nombre: "",
      especialidad: "",
      email: "",
      telefono: "",
      foto: "",
    })
    setMostrarFormulario(true)
  }

  const handleCancelar = () => {
    setMostrarFormulario(false)
    setNuevoVeterinario({
      nombre: "",
      especialidad: "",
      email: "",
      telefono: "",
      foto: "",
    })
    setEditandoId(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!nuevoVeterinario.nombre || !nuevoVeterinario.especialidad || !nuevoVeterinario.email) {
      mostrarNotificacion("Nombre, especialidad y email son obligatorios", "error")
      return
    }

    if (editandoId) {
      setVeterinarios(
        veterinarios.map((vet) => (vet.id === editandoId ? { ...nuevoVeterinario, id: editandoId } : vet)),
      )
      mostrarNotificacion("Veterinario actualizado correctamente", "exito")
    } else {
      const nuevoId = veterinarios.length > 0 ? Math.max(...veterinarios.map((v) => v.id)) + 1 : 1
      setVeterinarios([...veterinarios, { ...nuevoVeterinario, id: nuevoId }])
      mostrarNotificacion("Veterinario agregado correctamente", "exito")
    }

    handleCancelar()
  }

  const handleEditar = (veterinario) => {
    setEditandoId(veterinario.id)
    setNuevoVeterinario({ ...veterinario })
    setMostrarFormulario(true)
  }

  const handleEliminar = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar este veterinario?")
    if (confirmacion) {
      setVeterinarios(veterinarios.filter((vet) => vet.id !== id))
      mostrarNotificacion("Veterinario eliminado correctamente", "exito")
    }
  }

  const veterinariosFiltrados = veterinarios.filter((vet) => {
    const coincideBusqueda =
      vet.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      vet.especialidad.toLowerCase().includes(busqueda.toLowerCase()) ||
      vet.email.toLowerCase().includes(busqueda.toLowerCase())

    const coincideEspecialidad = especialidadFiltro ? vet.especialidad === especialidadFiltro : true

    return coincideBusqueda && coincideEspecialidad
  })

  const especialidades = [...new Set(veterinarios.map((vet) => vet.especialidad))]

  return (
    <AdminLayout> 
    <div className="veterinarios">
      <h1>Veterinarios Registrados</h1>
      {notificacion.mostrar && (
        <div className={`notificacion ${notificacion.tipo}`}>
          <FontAwesomeIcon icon={notificacion.tipo === "exito" ? faCheck : faTimes} />
          {notificacion.mensaje}
        </div>
      )}
      <div className="controles-superiores">
        <div className="busqueda-container">
          <input
            type="text"
            placeholder="Buscar veterinarios..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="icono-busqueda" />
        </div>

        <select
          value={especialidadFiltro}
          onChange={(e) => setEspecialidadFiltro(e.target.value)}
          className="filtro-especialidad"
        >
          <option value="">Todas las especialidades</option>
          {especialidades.map((esp, index) => (
            <option key={index} value={esp}>
              {esp}
            </option>
          ))}
        </select>
      </div>

      {mostrarFormulario && (
        <form className="formulario-veterinario" onSubmit={handleSubmit}>
          <h2>{editandoId ? "Editar Veterinario" : "Agregar Nuevo Veterinario"}</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Nombre completo:</label>
              <input type="text" name="nombre" value={nuevoVeterinario.nombre} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Especialidad:</label>
              <input
                type="text"
                name="especialidad"
                value={nuevoVeterinario.especialidad}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={nuevoVeterinario.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Teléfono:</label>
              <input type="tel" name="telefono" value={nuevoVeterinario.telefono} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Foto:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {nuevoVeterinario.foto && (
              <img src={nuevoVeterinario.foto || "/placeholder.svg"} alt="Previsualización" className="preview-image" />
            )}
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-guardar">
              {editandoId ? "Guardar Cambios" : "Agregar Veterinario"}
            </button>
            <button type="button" className="btn-cancelar" onClick={handleCancelar}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="tabla-container">
        <table className="tabla-veterinarios">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {veterinariosFiltrados.map((vet) => (
              <tr key={vet.id}>
                <td>
                  <img
                    src={vet.foto || "https://via.placeholder.com/50?text=Sin+imagen"}
                    alt={vet.nombre}
                    className="foto-veterinario"
                  />
                </td>
                <td>{vet.nombre}</td>
                <td>{vet.especialidad}</td>
                <td>{vet.email}</td>
                <td>{vet.telefono || "-"}</td>
                <td className="acciones-tabla">
                  <button onClick={() => handleEditar(vet)} className="btn-editar">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleEliminar(vet.id)} className="btn-eliminar">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {veterinariosFiltrados.length === 0 && (
        <p className="sin-resultados">
          {busqueda || especialidadFiltro
            ? "No se encontraron veterinarios con ese criterio"
            : "No hay veterinarios registrados"}
        </p>
      )}
    </div>
    </AdminLayout>
  )
}

export default Veterinarios