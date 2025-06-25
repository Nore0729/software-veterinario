import { useState, useEffect } from "react";
import {
  FaCalendarPlus,
  FaPaw,
  FaClock,
  FaStethoscope,
  FaStickyNote,
  FaCheck,
} from "react-icons/fa";
import axios from "axios";
import "../styles/User.css";

const AgendarCita = () => {
  const [formData, setFormData] = useState({
    mascota: "",
    servicio: "",
    veterinario: "", // Agregado veterinario aquí
    fecha: "",
    hora: "",
    notas: "",
  });
  const [mascotas, setMascotas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]); // Estado veterinarios
  const [citasExistentes, setCitasExistentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const horariosDisponibles = [
    "08:00", "08:30", "09:00", "09:30", "10:00",
    "10:30", "11:00", "11:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00",
    "17:30", "18:00"
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      const doc = localStorage.getItem("doc_pro");
      if (!doc) return;

      try {
        const [mascotasRes, serviciosRes, veterinariosRes, citasRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/mascotas/propietario/${doc}`),
          axios.get('http://localhost:3000/api/servicios'),
          // axios.get('http://localhost:3000/api/veterinarios'),
          // axios.get(`http://localhost:3000/api/citas-existentes/${doc}`),
        ]);
        setMascotas(mascotasRes.data);
        setServicios(serviciosRes.data);
        setVeterinarios(veterinariosRes.data);
        setCitasExistentes(citasRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    cargarDatos();
  }, []);

  // Aquí se verifica la disponibilidad por fecha, hora y veterinario
  const verificarDisponibilidad = (fecha, hora) => {
    if (!formData.veterinario) return true; // si no hay veterinario seleccionado, no bloquear horarios
    return !citasExistentes.some(
      (cita) =>
        cita.fecha === fecha &&
        cita.hora === hora &&
        cita.veterinario_id === parseInt(formData.veterinario)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (mensaje.texto) setMensaje({ tipo: "", texto: "" });
  };

  const validarFormulario = () => {
    const { mascota, servicio, veterinario, fecha, hora } = formData;
    if (!mascota || !servicio || !veterinario || !fecha || !hora) {
      setMensaje({ tipo: "error", texto: "Por favor completa todos los campos obligatorios" });
      return false;
    }

    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
      setMensaje({ tipo: "error", texto: "No puedes agendar citas en fechas pasadas" });
      return false;
    }

    if (!verificarDisponibilidad(fecha, hora)) {
      setMensaje({ tipo: "error", texto: "Esta fecha y hora ya están ocupadas para el veterinario seleccionado." });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setLoading(true);

    try {
      const doc = localStorage.getItem("doc_pro");
      const mascotaSeleccionada = mascotas.find((m) => m.id === parseInt(formData.mascota));
      const servicioSeleccionado = servicios.find((s) => s.id === parseInt(formData.servicio));
      const veterinarioSeleccionado = veterinarios.find((v) => v.id === parseInt(formData.veterinario));

      const citaData = {
        propietario_doc: doc,
        mascota_id: formData.mascota,
        mascota_nombre: mascotaSeleccionada?.nombre,
        servicio: servicioSeleccionado?.nombre,
        veterinario_id: formData.veterinario,
        veterinario_nombre: veterinarioSeleccionado?.nombre,
        fecha: formData.fecha,
        hora: formData.hora,
        notas: formData.notas,
        estado: "programada",
      };

      const res = await axios.post("/api/agendar-cita", citaData);
      if (!res.data) throw new Error();

      setMostrarConfirmacion(true);
      setMensaje({ tipo: "success", texto: "¡Cita agendada exitosamente!" });
      setFormData({ mascota: "", servicio: "", veterinario: "", fecha: "", hora: "", notas: "" });
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al agendar la cita. Intenta de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  const obtenerFechaMinima = () => new Date().toISOString().split("T")[0];

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
              <FaPaw /> <strong>Mascota:</strong> {mascotas.find(m => m.id === parseInt(formData.mascota))?.nombre}
            </div>
            <div className="detail-row">
              <FaStethoscope /> <strong>Servicio:</strong> {servicios.find(s => s.id === parseInt(formData.servicio))?.nombre}
            </div>
            <div className="detail-row">
              <FaStethoscope /> <strong>Veterinario:</strong> {veterinarios.find(v => v.id === parseInt(formData.veterinario))?.nombre}
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
            <button className="btn-primary" onClick={() => setMostrarConfirmacion(false)}>Agendar Nueva Cita</button>
            <button className="btn-secondary" onClick={() => (window.location.href = "/citas-proximas")}>Ver Mis Citas</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-form-container">
      <div className="info-card">
        <h2><FaCalendarPlus /> Agendar Nueva Cita</h2>
        {mensaje.texto && <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}
        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label htmlFor="mascota"><FaPaw /> Selecciona tu mascota *</label>
            <select name="mascota" value={formData.mascota} onChange={handleInputChange} required>
              <option value="">-- Selecciona una mascota --</option>
              {mascotas.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre} ({m.especie})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="servicio"><FaStethoscope /> Tipo de servicio *</label>
            <select name="servicio" value={formData.servicio} onChange={handleInputChange} required>
              <option value="">-- Selecciona un servicio --</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre} ({s.duracion} min)</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="veterinario"><FaStethoscope /> Elija Veterinario *</label>
            <select name="veterinario" value={formData.veterinario} onChange={handleInputChange} required>
              <option value="">-- Selecciona un veterinario--</option>
              {veterinarios.map((v) => (
                <option key={v.id} value={v.id}>{v.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fecha"><FaCalendarPlus /> Fecha *</label>
            <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} min={obtenerFechaMinima()} required />
          </div>

          <div className="form-group">
            <label htmlFor="hora"><FaClock /> Hora *</label>
            <select name="hora" value={formData.hora} onChange={handleInputChange} required>
              <option value="">-- Selecciona una hora --</option>
              {horariosDisponibles.map((hora) => {
                const disponible = formData.fecha ? verificarDisponibilidad(formData.fecha, hora) : true;
                return (
                  <option key={hora} value={hora} disabled={!disponible} style={{ color: disponible ? 'inherit' : '#ccc' }}>
                    {hora} {!disponible ? '(Ocupado)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notas"><FaStickyNote /> Notas (opcional)</label>
            <textarea name="notas" value={formData.notas} onChange={handleInputChange} rows="4" placeholder="Describe síntomas, observaciones, etc..." />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Agendando..." : "Confirmar Cita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgendarCita;
