import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faEdit, faTrash, faSearch, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"
import "../../Estilos_F/Administrador/Administrador.css"
import AdminLayout from "../Administrador/AdminLayout"

function Administradores() {
  const [administradores, setAdministradores] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [rolFiltro, setRolFiltro] = useState("")
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [nuevoAdministrador, setNuevoAdministrador] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "Administrador",
    estado: "Activo",
    foto: "",
    password: "",
    confirmarPassword: "",
  })
  const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: "", tipo: "" })
  const [mostrarPassword, setMostrarPassword] = useState(false)

  useEffect(() => {
    // Simulación de datos de administradores
    setAdministradores([
      {
        id: 1,
        nombre: "Carlos Rodríguez",
        email: "carlos@petlovers.com",
        telefono: "555-123-4567",
        rol: "Super Admin",
        estado: "Activo",
        foto: "",
      },
      {
        id: 2,
        nombre: "Ana López",
        email: "ana@petlovers.com",
        telefono: "555-234-5678",
        rol: "Administrador",
        estado: "Activo",
        foto: "",
      },
      {
        id: 3,
        nombre: "Miguel Fernández",
        email: "miguel@petlovers.com",
        telefono: "555-345-6789",
        rol: "Moderador",
        estado: "Inactivo",
        foto: "",
      },
      {
        id: 4,
        nombre: "Laura Martínez",
        email: "laura@petlovers.com",
        telefono: "555-456-7890",
        rol: "Administrador",
        estado: "Activo",
        foto: "",
      },
    ])
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setNuevoAdministrador({ ...nuevoAdministrador, [name]: value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNuevoAdministrador({ ...nuevoAdministrador, foto: reader.result })
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
    setNuevoAdministrador({
      nombre: "",
      email: "",
      telefono: "",
      rol: "Administrador",
      estado: "Activo",
      foto: "",
      password: "",
      confirmarPassword: "",
    })
    setMostrarFormulario(true)
    setMostrarPassword(true)
  }

  const handleCancelar = () => {
    setMostrarFormulario(false)
    setNuevoAdministrador({
      nombre: "",
      email: "",
      telefono: "",
      rol: "Administrador",
      estado: "Activo",
      foto: "",
      password: "",
      confirmarPassword: "",
    })
    setEditandoId(null)
    setMostrarPassword(false)
  }

  const validarFormulario = () => {
    if (!nuevoAdministrador.nombre || !nuevoAdministrador.email || !nuevoAdministrador.rol) {
      mostrarNotificacion("Nombre, email y rol son obligatorios", "error")
      return false
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(nuevoAdministrador.email)) {
      mostrarNotificacion("El formato del email no es válido", "error")
      return false
    }

    // Validar contraseña solo si es nuevo administrador o si se está cambiando
    if (mostrarPassword) {
      if (!nuevoAdministrador.password) {
        mostrarNotificacion("La contraseña es obligatoria", "error")
        return false
      }

      if (nuevoAdministrador.password.length < 6) {
        mostrarNotificacion("La contraseña debe tener al menos 6 caracteres", "error")
        return false
      }

      if (nuevoAdministrador.password !== nuevoAdministrador.confirmarPassword) {
        mostrarNotificacion("Las contraseñas no coinciden", "error")
        return false
      }
    }

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    // Omitir contraseña en el objeto a guardar si estamos editando y no se cambió
    const adminData = { ...nuevoAdministrador }
    if (!mostrarPassword) {
      delete adminData.password
      delete adminData.confirmarPassword
    }

    if (editandoId) {
      setAdministradores(
        administradores.map((admin) => (admin.id === editandoId ? { ...adminData, id: editandoId } : admin)),
      )
      mostrarNotificacion("Administrador actualizado correctamente", "exito")
    } else {
      const nuevoId = administradores.length > 0 ? Math.max(...administradores.map((a) => a.id)) + 1 : 1
      setAdministradores([...administradores, { ...adminData, id: nuevoId }])
      mostrarNotificacion("Administrador agregado correctamente", "exito")
    }

    handleCancelar()
  }

  const handleEditar = (administrador) => {
    setEditandoId(administrador.id)
    // No incluir contraseña al editar
    const adminSinPassword = { ...administrador, password: "", confirmarPassword: "" }
    setNuevoAdministrador(adminSinPassword)
    setMostrarFormulario(true)
    setMostrarPassword(false) // Por defecto no mostrar campos de contraseña al editar
  }

  const handleEliminar = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar este administrador?")
    if (confirmacion) {
      setAdministradores(administradores.filter((admin) => admin.id !== id))
      mostrarNotificacion("Administrador eliminado correctamente", "exito")
    }
  }

  const toggleCambiarPassword = () => {
    setMostrarPassword(!mostrarPassword)
    if (!mostrarPassword) {
      setNuevoAdministrador({
        ...nuevoAdministrador,
        password: "",
        confirmarPassword: "",
      })
    }
  }

  const administradoresFiltrados = administradores.filter((admin) => {
    const coincideBusqueda =
      admin.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      admin.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      admin.rol.toLowerCase().includes(busqueda.toLowerCase())

    const coincideRol = rolFiltro ? admin.rol === rolFiltro : true

    return coincideBusqueda && coincideRol
  })

  const roles = [...new Set(administradores.map((admin) => admin.rol))]

  return (
    <AdminLayout>
    <div className="administradores-container">
      <h1>Administradores del Sistema</h1>

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
            placeholder="Buscar administradores..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="icono-busqueda" />
        </div>

        <select value={rolFiltro} onChange={(e) => setRolFiltro(e.target.value)} className="filtro-rol">
          <option value="">Todos los roles</option>
          {roles.map((rol, index) => (
            <option key={index} value={rol}>
              {rol}
            </option>
          ))}
        </select>
      </div>

      {mostrarFormulario && (
        <form className="formulario-administrador" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre completo:</label>
              <input type="text" name="nombre" value={nuevoAdministrador.nombre} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={nuevoAdministrador.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Teléfono:</label>
              <input type="tel" name="telefono" value={nuevoAdministrador.telefono} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Rol:</label>
              <select name="rol" value={nuevoAdministrador.rol} onChange={handleChange} required>
                <option value="Super Admin">Super Admin</option>
                <option value="Administrador">Administrador</option>
                <option value="Moderador">Moderador</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Estado:</label>
              <select name="estado" value={nuevoAdministrador.estado} onChange={handleChange}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="form-group">
              <label>Foto:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {nuevoAdministrador.foto && (
                <img
                  src={nuevoAdministrador.foto || "/placeholder.svg"}
                  alt="Previsualización"
                  className="preview-image"
                />
              )}
            </div>
          </div>

          {editandoId && (
            <div className="cambiar-password">
              <button type="button" className="btn-toggle-password" onClick={toggleCambiarPassword}>
                {mostrarPassword ? "Cancelar cambio de contraseña" : "Cambiar contraseña"}
              </button>
            </div>
          )}

          {mostrarPassword && (
            <div className="form-row password-section">
              <div className="form-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  value={nuevoAdministrador.password}
                  onChange={handleChange}
                  required={mostrarPassword}
                />
              </div>

              <div className="form-group">
                <label>Confirmar Contraseña:</label>
                <input
                  type="password"
                  name="confirmarPassword"
                  value={nuevoAdministrador.confirmarPassword}
                  onChange={handleChange}
                  required={mostrarPassword}
                />
              </div>
            </div>
          )}

          <div className="form-buttons">
            <button type="submit" className="btn-guardar">
              {editandoId ? "Guardar Cambios" : "Agregar Administrador"}
            </button>
            <button type="button" className="btn-cancelar" onClick={handleCancelar}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="tabla-container">
        <table className="tabla-administradores">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {administradoresFiltrados.map((admin) => (
              <tr key={admin.id} className={admin.estado === "Inactivo" ? "fila-inactiva" : ""}>
                <td>
                  <img
                    src={admin.foto || "https://via.placeholder.com/50?text=Admin"}
                    alt={admin.nombre}
                    className="foto-administrador"
                  />
                </td>
                <td>{admin.nombre}</td>
                <td>{admin.email}</td>
                <td>{admin.telefono || "-"}</td>
                <td>
                  <span className={`badge-rol ${admin.rol.toLowerCase().replace(/\s+/g, "-")}`}>{admin.rol}</span>
                </td>
                <td>
                  <span className={`badge-estado ${admin.estado.toLowerCase()}`}>{admin.estado}</span>
                </td>
                <td className="acciones-tabla">
                  <button onClick={() => handleEditar(admin)} className="btn-editar">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleEliminar(admin.id)} className="btn-eliminar">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {administradoresFiltrados.length === 0 && (
        <p className="sin-resultados">
          {busqueda || rolFiltro
            ? "No se encontraron administradores con ese criterio"
            : "No hay administradores registrados"}
        </p>
      )}
    </div>
    </AdminLayout>
  )
}

export default Administradores
