"use client"

import { useState, useEffect } from "react"
import { FaCalendarPlus, FaPaw, FaClock, FaStethoscope, FaStickyNote, FaCheck } from "react-icons/fa"
import "../styles/User.css"

const AgendarCita = () => {
  const [formData, setFormData] = useState({
    mascota: "",
    servicio: "",
    fecha: "",
    hora: "",
    notas: "",
  })

  const [mascotas, setMascotas] = useState([])
  const [citasExistentes, setCitasExistentes] = useState([])
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" })
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)

  // Servicios disponibles
  const servicios = [
    { id: "consulta-general", nombre: "Consulta General", duracion: 30 },
    { id: "vacunacion", nombre: "Vacunación", duracion: 20 },
    { id: "control-anual", nombre: "Control Anual", duracion: 45 },
    { id: "cirugia-menor", nombre: "Cirugía Menor", duracion: 60 },
    { id: "limpieza-dental", nombre: "Limpieza Dental", duracion: 90 },
    { id: "emergencia", nombre: "Emergencia", duracion: 30 },
  ]

  // Horarios disponibles
  const horariosDisponibles = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ]

  useEffect(() => {
    cargarMascotas()
    cargarCitasExistentes()
  }, [])

  const cargarMascotas = async () => {
    try {
      const doc = localStorage.getItem("doc")
      if (doc) {
        const response = await fetch(`/api/mis-mascotas/${doc}`)
        const data = await response.json()
        setMascotas(data)
      }
    } catch (error) {
      console.error("Error al cargar mascotas:", error)
    }
  }

  const cargarCitasExistentes = async () => {
    try {
      const doc = localStorage.getItem("doc")
      if (doc) {
        const response = await fetch(`/api/citas-existentes/${doc}`)
        const data = await response.json()
        setCitasExistentes(data)
      }
    } catch (error) {
      console.error("Error al cargar citas:", error)
    }
  }

  const verificarDisponibilidad = (fecha, hora) => {
    const fechaHora = `${fecha} ${hora}`
    return !citasExistentes.some((cita) => `${cita.fecha} ${cita.hora}` === fechaHora)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpiar mensaje cuando el usuario modifique los campos
    if (mensaje.texto) {
      setMensaje({ tipo: "", texto: "" })
    }
  }

  const validarFormulario = () => {
    if (!formData.mascota) {
      setMensaje({ tipo: "error", texto: "Por favor selecciona una mascota" })
      return false
    }
    if (!formData.servicio) {
      setMensaje({ tipo: "error", texto: "Por favor selecciona un servicio" })
      return false
    }
    if (!formData.fecha) {
      setMensaje({ tipo: "error", texto: "Por favor selecciona una fecha" })
      return false
    }
    if (!formData.hora) {
      setMensaje({ tipo: "error", texto: "Por favor selecciona una hora" })
      return false
    }

    // Verificar que la fecha no sea en el pasado
    const fechaSeleccionada = new Date(formData.fecha)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    if (fechaSeleccionada < hoy) {
      setMensaje({ tipo: "error", texto: "No puedes agendar citas en fechas pasadas" })
      return false
    }

    // Verificar disponibilidad
    if (!verificarDisponibilidad(formData.fecha, formData.hora)) {
      setMensaje({ tipo: "error", texto: "Esta fecha y hora ya están ocupadas. Por favor selecciona otra." })
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarFormulario()) return

    setLoading(true)

    try {
      const doc = localStorage.getItem("doc")
      const mascotaSeleccionada = mascotas.find((m) => m.id === Number.parseInt(formData.mascota))
      const servicioSeleccionado = servicios.find((s) => s.id === formData.servicio)

      const citaData = {
        propietario_doc: doc,
        mascota_id: formData.mascota,
        mascota_nombre: mascotaSeleccionada?.nombre,
        servicio: servicioSeleccionado?.nombre,
        fecha: formData.fecha,
        hora: formData.hora,
        notas: formData.notas,
        estado: "programada",
      }

      const response = await fetch("/api/agendar-cita", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(citaData),
      })

      if (response.ok) {
        setMostrarConfirmacion(true)
        setMensaje({ tipo: "success", texto: "¡Cita agendada exitosamente!" })

        // Limpiar formulario
        setFormData({
          mascota: "",
          servicio: "",
          fecha: "",
          hora: "",
          notas: "",
        })

        // Recargar citas existentes
        cargarCitasExistentes()
      } else {
        throw new Error("Error al agendar la cita")
      }
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al agendar la cita. Inténtalo nuevamente." })
    } finally {
      setLoading(false)
    }
  }

  const obtenerFechaMinima = () => {
    const hoy = new Date()
    return hoy.toISOString().split("T")[0]
  }

  if (mostrarConfirmacion) {
    return (
      <div className="appointment-form-container">
        <div className="info-card confirmation-card">
          <div className="confirmation-header">
            <FaCheck className="confirmation-icon" />
            <h2>¡Cita Agendada Exitosamente!</h2>
          </div>

          <div className="appointment-details">
            <h3>Detalles de tu cita:</h3>
            <div className="detail-row">
              <FaPaw /> <strong>Mascota:</strong>{" "}
              {mascotas.find((m) => m.id === Number.parseInt(formData.mascota))?.nombre}
            </div>
            <div className="detail-row">
              <FaStethoscope /> <strong>Servicio:</strong> {servicios.find((s) => s.id === formData.servicio)?.nombre}
            </div>
            <div className="detail-row">
              <FaCalendarPlus /> <strong>Fecha:</strong> {new Date(formData.fecha).toLocaleDateString("es-ES")}
            </div>
            <div className="detail-row">
              <FaClock /> <strong>Hora:</strong> {formData.hora}
            </div>
            {formData.notas && (
              <div className="detail-row">
                <FaStickyNote /> <strong>Notas:</strong> {formData.notas}
              </div>
            )}
          </div>

          <div className="confirmation-actions">
            <button className="btn-primary" onClick={() => setMostrarConfirmacion(false)}>
              Agendar Nueva Cita
            </button>
            <button className="btn-secondary" onClick={() => (window.location.href = "/citas-proximas")}>
              Ver Mis Citas
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="appointment-form-container">
      <div className="info-card">
        <h2>
          <FaCalendarPlus /> Agendar Nueva Cita
        </h2>

        {mensaje.texto && <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}

        <form onSubmit={handleSubmit} className="appointment-form">
          {/* Selección de Mascota */}
          <div className="form-group">
            <label htmlFor="mascota">
              <FaPaw /> Selecciona tu mascota *
            </label>
            <select id="mascota" name="mascota" value={formData.mascota} onChange={handleInputChange} required>
              <option value="">-- Selecciona una mascota --</option>
              {mascotas.map((mascota) => (
                <option key={mascota.id} value={mascota.id}>
                  {mascota.nombre} ({mascota.especie})
                </option>
              ))}
            </select>
          </div>

          {/* Selección de Servicio */}
          <div className="form-group">
            <label htmlFor="servicio">
              <FaStethoscope /> Tipo de servicio *
            </label>
            <select id="servicio" name="servicio" value={formData.servicio} onChange={handleInputChange} required>
              <option value="">-- Selecciona un servicio --</option>
              {servicios.map((servicio) => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.nombre} ({servicio.duracion} min)
                </option>
              ))}
            </select>
          </div>

          {/* Selección de Fecha */}
          <div className="form-group">
            <label htmlFor="fecha">
              <FaCalendarPlus /> Fecha de la cita *
            </label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              min={obtenerFechaMinima()}
              required
            />
          </div>

          {/* Selección de Hora */}
          <div className="form-group">
            <label htmlFor="hora">
              <FaClock /> Hora de la cita *
            </label>
            <select id="hora" name="hora" value={formData.hora} onChange={handleInputChange} required>
              <option value="">-- Selecciona una hora --</option>
              {horariosDisponibles.map((hora) => {
                const disponible = formData.fecha ? verificarDisponibilidad(formData.fecha, hora) : true
                return (
                  <option
                    key={hora}
                    value={hora}
                    disabled={!disponible}
                    style={{ color: disponible ? "inherit" : "#ccc" }}
                  >
                    {hora} {!disponible ? "(Ocupado)" : ""}
                  </option>
                )
              })}
            </select>
          </div>

          {/* Notas adicionales */}
          <div className="form-group">
            <label htmlFor="notas">
              <FaStickyNote /> Notas adicionales (opcional)
            </label>
            <textarea
              id="notas"
              name="notas"
              value={formData.notas}
              onChange={handleInputChange}
              placeholder="Describe cualquier síntoma o información relevante..."
              rows="4"
            />
          </div>

          {/* Botón único */}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Agendando..." : "Confirmar Cita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AgendarCita
