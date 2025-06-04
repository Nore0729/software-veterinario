"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Stethoscope,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Calendar,
  User,
  Dog,
  Cat,
  Heart,
  Thermometer,
  Weight,
  Pill,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Download,
  PrinterIcon as Print,
  Activity,
  Clipboard,
} from "lucide-react"
import "../Estilos_F/ConsultasVet.css"

const VetConsultas = () => {
  const [consultas, setConsultas] = useState([])
  const [estadisticas, setEstadisticas] = useState({})
  const [filtros, setFiltros] = useState({
    busqueda: "",
    mascota: "todas",
    veterinario: "todos",
    fechaInicio: "",
    fechaFin: "",
    estado: "todos",
  })
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modalNuevaConsulta, setModalNuevaConsulta] = useState(false)
  const [loading, setLoading] = useState(true)

  // Datos de ejemplo (en producción vendrían de la API)
  const consultasEjemplo = [
    {
      id: 1,
      fecha: "2024-01-15",
      hora: "09:30",
      mascota: {
        id: 1,
        nombre: "Max",
        especie: "Perro",
        raza: "Golden Retriever",
        edad: "3 años",
        propietario: "Juan Pérez",
        telefono: "3001234567",
      },
      veterinario: "Dr. Ana Veterinaria",
      motivo: "Control anual y vacunación",
      sintomas: "Ninguno aparente, mascota activa y alerta",
      diagnostico: "Estado de salud excelente",
      tratamiento: "Continuar con dieta actual y ejercicio regular",
      medicamentos: [
        { nombre: "Vacuna Múltiple", dosis: "1 ml", frecuencia: "Anual" },
        { nombre: "Desparasitante", dosis: "1 tableta", frecuencia: "Cada 3 meses" },
      ],
      signosVitales: {
        peso: "25.5 kg",
        temperatura: "38.2°C",
        frecuenciaCardiaca: "90 bpm",
        frecuenciaRespiratoria: "25 rpm",
      },
      observaciones: "Mascota muy activa y sociable. Propietario muy responsable con el cuidado.",
      proximaCita: "2024-07-15",
      estado: "completada",
      archivos: ["radiografia_torax.jpg", "analisis_sangre.pdf"],
    },
    {
      id: 2,
      fecha: "2024-01-08",
      hora: "15:00",
      mascota: {
        id: 3,
        nombre: "Rocky",
        especie: "Perro",
        raza: "Bulldog",
        edad: "4 años",
        propietario: "Carlos Ramírez",
        telefono: "3209876543",
      },
      veterinario: "Dr. Ana Veterinaria",
      motivo: "Dificultad respiratoria",
      sintomas: "Respiración laboriosa, especialmente después del ejercicio",
      diagnostico: "Síndrome braquicefálico leve",
      tratamiento: "Medicamento broncodilatador, evitar ejercicio intenso en clima caluroso",
      medicamentos: [
        { nombre: "Broncodilatador", dosis: "0.5 ml", frecuencia: "Cada 12 horas por 7 días" },
        { nombre: "Antiinflamatorio", dosis: "1/2 tableta", frecuencia: "Cada 24 horas por 5 días" },
      ],
      signosVitales: {
        peso: "18.2 kg",
        temperatura: "38.5°C",
        frecuenciaCardiaca: "110 bpm",
        frecuenciaRespiratoria: "35 rpm",
      },
      observaciones: "Mejoría notable desde última consulta. Recomendar pérdida de peso gradual.",
      proximaCita: "2024-02-08",
      estado: "completada",
      archivos: ["radiografia_torax.jpg"],
    },
    {
      id: 3,
      fecha: "2024-01-12",
      hora: "11:15",
      mascota: {
        id: 2,
        nombre: "Luna",
        especie: "Gato",
        raza: "Siamés",
        edad: "2 años",
        propietario: "María García",
        telefono: "3009876543",
      },
      veterinario: "Dr. Ana Veterinaria",
      motivo: "Control post-esterilización",
      sintomas: "Cicatrización normal, comportamiento normal",
      diagnostico: "Recuperación post-quirúrgica exitosa",
      tratamiento: "Continuar con cuidados post-operatorios",
      medicamentos: [{ nombre: "Antibiótico", dosis: "1/4 tableta", frecuencia: "Cada 12 horas por 3 días más" }],
      signosVitales: {
        peso: "4.2 kg",
        temperatura: "38.0°C",
        frecuenciaCardiaca: "180 bpm",
        frecuenciaRespiratoria: "30 rpm",
      },
      observaciones: "Excelente recuperación. Propietaria muy atenta a las indicaciones.",
      proximaCita: "2024-02-12",
      estado: "completada",
      archivos: [],
    },
    {
      id: 4,
      fecha: "2024-01-20",
      hora: "14:30",
      mascota: {
        id: 4,
        nombre: "Lazi",
        especie: "Perro",
        raza: "Pincher",
        edad: "1 año",
        propietario: "Ana López",
        telefono: "3156789012",
      },
      veterinario: "Dr. Ana Veterinaria",
      motivo: "Vacunación y control de crecimiento",
      sintomas: "Ninguno, desarrollo normal",
      diagnostico: "Desarrollo adecuado para la edad",
      tratamiento: "Continuar con alimentación balanceada",
      medicamentos: [
        { nombre: "Vacuna Múltiple", dosis: "0.5 ml", frecuencia: "Anual" },
        { nombre: "Vitaminas", dosis: "1 ml", frecuencia: "Diario por 30 días" },
      ],
      signosVitales: {
        peso: "4.0 kg",
        temperatura: "38.1°C",
        frecuenciaCardiaca: "120 bpm",
        frecuenciaRespiratoria: "28 rpm",
      },
      observaciones: "Cachorra muy energética y saludable. Socialización excelente.",
      proximaCita: "2024-04-20",
      estado: "completada",
      archivos: ["certificado_vacunacion.pdf"],
    },
  ]

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setConsultas(consultasEjemplo)
      setEstadisticas({
        totalConsultas: 4,
        consultasEsteMes: 4,
        mascotasAtendidas: 4,
        proximasConsultas: 2,
      })
      setLoading(false)
    }, 1000)
  }, [])

  // Filtrar consultas
  const consultasFiltradas = consultas.filter((consulta) => {
    const coincideBusqueda =
      consulta.mascota.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      consulta.mascota.propietario.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      consulta.diagnostico.toLowerCase().includes(filtros.busqueda.toLowerCase())

    const coincideMascota =
      filtros.mascota === "todas" || consulta.mascota.especie.toLowerCase() === filtros.mascota.toLowerCase()

    const coincideEstado = filtros.estado === "todos" || consulta.estado === filtros.estado

    const coincideFecha =
      (!filtros.fechaInicio || consulta.fecha >= filtros.fechaInicio) &&
      (!filtros.fechaFin || consulta.fecha <= filtros.fechaFin)

    return coincideBusqueda && coincideMascota && coincideEstado && coincideFecha
  })

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4 },
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2 },
    },
  }

  const abrirModal = (consulta) => {
    setConsultaSeleccionada(consulta)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setConsultaSeleccionada(null)
  }

  const abrirModalNuevaConsulta = () => {
    setModalNuevaConsulta(true)
  }

  const cerrarModalNuevaConsulta = () => {
    setModalNuevaConsulta(false)
  }

  if (loading) {
    return (
      <div className="vet-consultas-loading">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <Stethoscope size={48} />
        </motion.div>
        <p>Cargando historial médico...</p>
      </div>
    )
  }

  return (
    <motion.div className="vet-consultas-container" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div className="vet-consultas-header" variants={itemVariants}>
        <div className="header-content">
          <h1>
            <Stethoscope className="header-icon" />
            Historial Médico
          </h1>
          <p>Gestiona y supervisa todas las consultas médicas realizadas</p>
        </div>
        <div className="header-actions">
          <motion.button
            className="btn-export"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Exportar historial"
          >
            <Download size={20} />
            Exportar
          </motion.button>
          <motion.button
            className="btn-nuevo"
            onClick={abrirModalNuevaConsulta}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            Nueva Consulta
          </motion.button>
        </div>
      </motion.div>

      {/* Estadísticas */}
      <motion.div className="estadisticas-grid" variants={itemVariants}>
        <motion.div className="estadistica-card" variants={cardVariants} whileHover="hover">
          <div className="estadistica-icon total">
            <Clipboard size={24} />
          </div>
          <div className="estadistica-info">
            <h3>{estadisticas.totalConsultas}</h3>
            <p>Total Consultas</p>
          </div>
        </motion.div>

        <motion.div className="estadistica-card" variants={cardVariants} whileHover="hover">
          <div className="estadistica-icon mes">
            <Calendar size={24} />
          </div>
          <div className="estadistica-info">
            <h3>{estadisticas.consultasEsteMes}</h3>
            <p>Este Mes</p>
          </div>
        </motion.div>

        <motion.div className="estadistica-card" variants={cardVariants} whileHover="hover">
          <div className="estadistica-icon mascotas">
            <Activity size={24} />
          </div>
          <div className="estadistica-info">
            <h3>{estadisticas.mascotasAtendidas}</h3>
            <p>Mascotas Atendidas</p>
          </div>
        </motion.div>

        <motion.div className="estadistica-card" variants={cardVariants} whileHover="hover">
          <div className="estadistica-icon proximas">
            <Clock size={24} />
          </div>
          <div className="estadistica-info">
            <h3>{estadisticas.proximasConsultas}</h3>
            <p>Seguimientos</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Filtros y Búsqueda */}
      <motion.div className="filtros-container" variants={itemVariants}>
        <div className="busqueda-container">
          <Search className="busqueda-icon" />
          <input
            type="text"
            placeholder="Buscar por mascota, propietario o diagnóstico..."
            value={filtros.busqueda}
            onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
            className="busqueda-input"
          />
        </div>

        <div className="filtros-opciones">
          <div className="filtro-grupo">
            <Filter size={16} />
            <select
              value={filtros.mascota}
              onChange={(e) => setFiltros({ ...filtros, mascota: e.target.value })}
              className="filtro-select"
            >
              <option value="todas">Todas las especies</option>
              <option value="perro">Perros</option>
              <option value="gato">Gatos</option>
            </select>
          </div>

          <div className="filtro-grupo">
            <Calendar size={16} />
            <input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
              className="filtro-date"
              placeholder="Fecha inicio"
            />
          </div>

          <div className="filtro-grupo">
            <Calendar size={16} />
            <input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
              className="filtro-date"
              placeholder="Fecha fin"
            />
          </div>
        </div>
      </motion.div>

      {/* Lista de Consultas */}
      <motion.div className="consultas-grid" variants={itemVariants}>
        <AnimatePresence>
          {consultasFiltradas.map((consulta, index) => (
            <motion.div
              key={consulta.id}
              className="consulta-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              whileHover="hover"
              transition={{ delay: index * 0.1 }}
            >
              <div className="consulta-header">
                <div className="consulta-fecha">
                  <Calendar size={16} />
                  <span>
                    {consulta.fecha} - {consulta.hora}
                  </span>
                </div>
                <div className="consulta-acciones">
                  <motion.button
                    className="btn-accion ver"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => abrirModal(consulta)}
                    title="Ver detalles"
                  >
                    <Eye size={16} />
                  </motion.button>
                  <motion.button
                    className="btn-accion editar"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Editar consulta"
                  >
                    <Edit size={16} />
                  </motion.button>
                  <motion.button
                    className="btn-accion imprimir"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Imprimir reporte"
                  >
                    <Print size={16} />
                  </motion.button>
                </div>
              </div>

              <div className="consulta-mascota">
                <div className="mascota-avatar">
                  {consulta.mascota.especie === "Perro" ? <Dog size={24} /> : <Cat size={24} />}
                </div>
                <div className="mascota-info">
                  <h3>{consulta.mascota.nombre}</h3>
                  <p>
                    {consulta.mascota.raza} - {consulta.mascota.edad}
                  </p>
                  <p className="propietario">
                    <User size={14} />
                    {consulta.mascota.propietario}
                  </p>
                </div>
              </div>

              <div className="consulta-detalles">
                <div className="motivo">
                  <strong>Motivo:</strong> {consulta.motivo}
                </div>
                <div className="diagnostico">
                  <strong>Diagnóstico:</strong> {consulta.diagnostico}
                </div>
                <div className="veterinario">
                  <strong>Veterinario:</strong> {consulta.veterinario}
                </div>
              </div>

              <div className="consulta-signos">
                <div className="signo-item">
                  <Weight size={14} />
                  <span>{consulta.signosVitales.peso}</span>
                </div>
                <div className="signo-item">
                  <Thermometer size={14} />
                  <span>{consulta.signosVitales.temperatura}</span>
                </div>
                <div className="signo-item">
                  <Heart size={14} />
                  <span>{consulta.signosVitales.frecuenciaCardiaca}</span>
                </div>
              </div>

              <div className="consulta-footer">
                <div className="medicamentos-count">
                  <Pill size={14} />
                  <span>{consulta.medicamentos.length} medicamento(s)</span>
                </div>
                <div className="estado-badge">
                  <CheckCircle size={12} />
                  <span>Completada</span>
                </div>
              </div>

              {consulta.proximaCita && (
                <div className="proxima-cita">
                  <Clock size={14} />
                  <span>Próximo control: {consulta.proximaCita}</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal de Detalles */}
      <AnimatePresence>
        {modalAbierto && consultaSeleccionada && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrarModal}
          >
            <motion.div
              className="modal-content consulta-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>
                  <Stethoscope size={24} />
                  Consulta Médica - {consultaSeleccionada.mascota.nombre}
                </h2>
                <button className="btn-cerrar" onClick={cerrarModal}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="consulta-completa">
                  {/* Información básica */}
                  <div className="seccion">
                    <h4>
                      <Calendar size={18} />
                      Información de la Consulta
                    </h4>
                    <div className="info-grid">
                      <div>
                        <strong>Fecha:</strong> {consultaSeleccionada.fecha}
                      </div>
                      <div>
                        <strong>Hora:</strong> {consultaSeleccionada.hora}
                      </div>
                      <div>
                        <strong>Veterinario:</strong> {consultaSeleccionada.veterinario}
                      </div>
                      <div>
                        <strong>Estado:</strong> {consultaSeleccionada.estado}
                      </div>
                    </div>
                  </div>

                  {/* Información de la mascota */}
                  <div className="seccion">
                    <h4>
                      {consultaSeleccionada.mascota.especie === "Perro" ? <Dog size={18} /> : <Cat size={18} />}
                      Información de la Mascota
                    </h4>
                    <div className="info-grid">
                      <div>
                        <strong>Nombre:</strong> {consultaSeleccionada.mascota.nombre}
                      </div>
                      <div>
                        <strong>Especie:</strong> {consultaSeleccionada.mascota.especie}
                      </div>
                      <div>
                        <strong>Raza:</strong> {consultaSeleccionada.mascota.raza}
                      </div>
                      <div>
                        <strong>Edad:</strong> {consultaSeleccionada.mascota.edad}
                      </div>
                      <div>
                        <strong>Propietario:</strong> {consultaSeleccionada.mascota.propietario}
                      </div>
                      <div>
                        <strong>Teléfono:</strong> {consultaSeleccionada.mascota.telefono}
                      </div>
                    </div>
                  </div>

                  {/* Motivo y síntomas */}
                  <div className="seccion">
                    <h4>
                      <AlertCircle size={18} />
                      Motivo y Síntomas
                    </h4>
                    <div className="texto-completo">
                      <div className="campo">
                        <strong>Motivo de consulta:</strong>
                        <p>{consultaSeleccionada.motivo}</p>
                      </div>
                      <div className="campo">
                        <strong>Síntomas observados:</strong>
                        <p>{consultaSeleccionada.sintomas}</p>
                      </div>
                    </div>
                  </div>

                  {/* Signos vitales */}
                  <div className="seccion">
                    <h4>
                      <Activity size={18} />
                      Signos Vitales
                    </h4>
                    <div className="signos-vitales-grid">
                      <div className="signo-vital">
                        <Weight size={16} />
                        <span>Peso</span>
                        <strong>{consultaSeleccionada.signosVitales.peso}</strong>
                      </div>
                      <div className="signo-vital">
                        <Thermometer size={16} />
                        <span>Temperatura</span>
                        <strong>{consultaSeleccionada.signosVitales.temperatura}</strong>
                      </div>
                      <div className="signo-vital">
                        <Heart size={16} />
                        <span>Freq. Cardíaca</span>
                        <strong>{consultaSeleccionada.signosVitales.frecuenciaCardiaca}</strong>
                      </div>
                      <div className="signo-vital">
                        <Activity size={16} />
                        <span>Freq. Respiratoria</span>
                        <strong>{consultaSeleccionada.signosVitales.frecuenciaRespiratoria}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Diagnóstico y tratamiento */}
                  <div className="seccion">
                    <h4>
                      <Stethoscope size={18} />
                      Diagnóstico y Tratamiento
                    </h4>
                    <div className="texto-completo">
                      <div className="campo">
                        <strong>Diagnóstico:</strong>
                        <p>{consultaSeleccionada.diagnostico}</p>
                      </div>
                      <div className="campo">
                        <strong>Tratamiento:</strong>
                        <p>{consultaSeleccionada.tratamiento}</p>
                      </div>
                    </div>
                  </div>

                  {/* Medicamentos */}
                  <div className="seccion">
                    <h4>
                      <Pill size={18} />
                      Medicamentos Prescritos
                    </h4>
                    <div className="medicamentos-lista">
                      {consultaSeleccionada.medicamentos.map((medicamento, index) => (
                        <div key={index} className="medicamento-item">
                          <div className="medicamento-nombre">{medicamento.nombre}</div>
                          <div className="medicamento-detalles">
                            <span>Dosis: {medicamento.dosis}</span>
                            <span>Frecuencia: {medicamento.frecuencia}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div className="seccion">
                    <h4>
                      <FileText size={18} />
                      Observaciones
                    </h4>
                    <div className="texto-completo">
                      <p>{consultaSeleccionada.observaciones}</p>
                    </div>
                  </div>

                  {/* Próxima cita */}
                  {consultaSeleccionada.proximaCita && (
                    <div className="seccion">
                      <h4>
                        <Clock size={18} />
                        Seguimiento
                      </h4>
                      <div className="proxima-cita-info">
                        <strong>Próxima cita recomendada:</strong> {consultaSeleccionada.proximaCita}
                      </div>
                    </div>
                  )}

                  {/* Archivos adjuntos */}
                  {consultaSeleccionada.archivos.length > 0 && (
                    <div className="seccion">
                      <h4>
                        <FileText size={18} />
                        Archivos Adjuntos
                      </h4>
                      <div className="archivos-lista">
                        {consultaSeleccionada.archivos.map((archivo, index) => (
                          <div key={index} className="archivo-item">
                            <FileText size={16} />
                            <span>{archivo}</span>
                            <button className="btn-descargar">
                              <Download size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-secundario" onClick={cerrarModal}>
                  Cerrar
                </button>
                <button className="btn-primario">
                  <Print size={16} />
                  Imprimir
                </button>
                <button className="btn-primario">
                  <Edit size={16} />
                  Editar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Nueva Consulta */}
      <AnimatePresence>
        {modalNuevaConsulta && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrarModalNuevaConsulta}
          >
            <motion.div
              className="modal-content nueva-consulta-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>
                  <Plus size={24} />
                  Nueva Consulta Médica
                </h2>
                <button className="btn-cerrar" onClick={cerrarModalNuevaConsulta}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <form className="nueva-consulta-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Mascota</label>
                      <select>
                        <option value="">Seleccionar mascota</option>
                        <option value="1">Max - Golden Retriever</option>
                        <option value="2">Luna - Siamés</option>
                        <option value="3">Rocky - Bulldog</option>
                        <option value="4">Lazi - Pincher</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Fecha</label>
                      <input type="date" />
                    </div>

                    <div className="form-group">
                      <label>Hora</label>
                      <input type="time" />
                    </div>

                    <div className="form-group">
                      <label>Veterinario</label>
                      <select>
                        <option value="">Seleccionar veterinario</option>
                        <option value="1">Dr. Ana Veterinaria</option>
                      </select>
                    </div>

                    <div className="form-group full-width">
                      <label>Motivo de consulta</label>
                      <textarea placeholder="Describe el motivo de la consulta..."></textarea>
                    </div>

                    <div className="form-group full-width">
                      <label>Síntomas observados</label>
                      <textarea placeholder="Describe los síntomas observados..."></textarea>
                    </div>

                    <div className="form-group">
                      <label>Peso (kg)</label>
                      <input type="number" step="0.1" placeholder="0.0" />
                    </div>

                    <div className="form-group">
                      <label>Temperatura (°C)</label>
                      <input type="number" step="0.1" placeholder="0.0" />
                    </div>

                    <div className="form-group">
                      <label>Freq. Cardíaca (bpm)</label>
                      <input type="number" placeholder="0" />
                    </div>

                    <div className="form-group">
                      <label>Freq. Respiratoria (rpm)</label>
                      <input type="number" placeholder="0" />
                    </div>

                    <div className="form-group full-width">
                      <label>Diagnóstico</label>
                      <textarea placeholder="Diagnóstico médico..."></textarea>
                    </div>

                    <div className="form-group full-width">
                      <label>Tratamiento</label>
                      <textarea placeholder="Tratamiento prescrito..."></textarea>
                    </div>

                    <div className="form-group full-width">
                      <label>Observaciones</label>
                      <textarea placeholder="Observaciones adicionales..."></textarea>
                    </div>

                    <div className="form-group">
                      <label>Próxima cita</label>
                      <input type="date" />
                    </div>
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button className="btn-secundario" onClick={cerrarModalNuevaConsulta}>
                  Cancelar
                </button>
                <button className="btn-primario">
                  <CheckCircle size={16} />
                  Guardar Consulta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default VetConsultas
