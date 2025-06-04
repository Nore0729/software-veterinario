"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from 'react-router-dom';

import {
  Dog,
  Cat,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Calendar,
  Weight,
  Heart,
  Shield,
  Users,
  PawPrint,
  X,
} from "lucide-react"
import "../Estilos_F/VetMascotas.css"

const VetMascotas = () => {
  const [mascotas, setMascotas] = useState([])
  const [estadisticas, setEstadisticas] = useState({})
  const [filtros, setFiltros] = useState({
    busqueda: "",
    especie: "todas",
    estado: "todos",
  })
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [loading, setLoading] = useState(true)

  // Datos de ejemplo (en producción vendrían de la API)
  const mascotasEjemplo = [
    {
      id: 1,
      nombre: "Max",
      especie: "Perro",
      raza: "Golden Retriever",
      genero: "Macho",
      edad: "3 años",
      peso: "25.5 kg",
      color: "Dorado",
      propietario_nombre: "Juan Pérez",
      propietario_telefono: "3001234567",
      vacunado: true,
      estadoReproductivo: "Entero",
      ultimaConsulta: "2024-01-10",
      observaciones: "Muy activo y juguetón",
    },
    {
      id: 2,
      nombre: "Luna",
      especie: "Gato",
      raza: "Siamés",
      genero: "Hembra",
      edad: "2 años",
      peso: "4.2 kg",
      color: "Crema",
      propietario_nombre: "María García",
      propietario_telefono: "3009876543",
      vacunado: true,
      estadoReproductivo: "Esterilizada",
      ultimaConsulta: "2024-01-08",
      observaciones: "Tranquila y cariñosa",
    },
    {
      id: 3,
      nombre: "Rocky",
      especie: "Perro",
      raza: "Bulldog",
      genero: "Macho",
      edad: "4 años",
      peso: "18.0 kg",
      color: "Blanco",
      propietario_nombre: "Carlos Ramírez",
      propietario_telefono: "3209876543",
      vacunado: true,
      estadoReproductivo: "Castrado",
      ultimaConsulta: "2024-01-05",
      observaciones: "Problemas respiratorios leves",
    },
    {
      id: 4,
      nombre: "Lazi",
      especie: "Perro",
      raza: "Pincher",
      genero: "Hembra",
      edad: "1 año",
      peso: "4.0 kg",
      color: "Blanca",
      propietario_nombre: "Ana López",
      propietario_telefono: "3156789012",
      vacunado: true,
      estadoReproductivo: "Castrada",
      ultimaConsulta: "2024-01-12",
      observaciones: "Muy energética",
    },
  ]

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setMascotas(mascotasEjemplo)
      setEstadisticas({
        totalMascotas: 4,
        perros: 3,
        gatos: 1,
        vacunadas: 4,
        noVacunadas: 0,
      })
      setLoading(false)
    }, 1000)
  }, [])

  // Filtrar mascotas
  const mascotasFiltradas = mascotas.filter((mascota) => {
    const coincideBusqueda =
      mascota.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      mascota.propietario_nombre.toLowerCase().includes(filtros.busqueda.toLowerCase())

    const coincideEspecie =
      filtros.especie === "todas" || mascota.especie.toLowerCase() === filtros.especie.toLowerCase()

    return coincideBusqueda && coincideEspecie
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

  const abrirModal = (mascota) => {
    setMascotaSeleccionada(mascota)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setMascotaSeleccionada(null)
  }

  if (loading) {
    return (
      <div className="vet-mascotas-loading">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <PawPrint size={48} />
        </motion.div>
        <p>Cargando mascotas...</p>
      </div>
    )
  }

  return (
    <motion.div className="vet-mascotas-container" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div className="vet-mascotas-header" variants={itemVariants}>
        <div className="header-content">
          <h1>
            <PawPrint className="header-icon" />
            Gestión de Mascotas
          </h1>
          <p>Administra y supervisa todas las mascotas registradas en el sistema</p>
        </div>
        <Link to="/nueva-mascota">
        <motion.button className="btn-nuevo" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Plus size={20} />
        Nueva Mascota
        </motion.button>
        </Link>
        </motion.div>

      {/* Estadísticas */}
      <motion.div className="estadisticas-grid" variants={itemVariants}>
        <motion.div className="estadistica-card" variants={cardVariants} whileHover="hover">
          <div className="estadistica-icon total">
            <Users size={24} />
          </div>
          <div className="estadistica-info">
            <h3>{estadisticas.totalMascotas}</h3>
            <p>Total Mascotas</p>
          </div>
        </motion.div>

        <motion.div className="estadistica-card" variants={cardVariants} whileHover="hover">
          <div className="estadistica-icon perros">
            <Dog size={24} />
          </div>
          <div className="estadistica-info">
            <h3>{estadisticas.perros}</h3>
            <p>Perros</p>
          </div>
        </motion.div>

        <motion.div className="estadistica-card" variants={cardVariants} whileHover="hover">
          <div className="estadistica-icon gatos">
            <Cat size={24} />
          </div>
          <div className="estadistica-info">
            <h3>{estadisticas.gatos}</h3>
            <p>Gatos</p>
          </div>
        </motion.div>

        <motion.div className="estadistica-card" variants={cardVariants} whileHover="hover">
          <div className="estadistica-icon vacunadas">
            <Shield size={24} />
          </div>
          <div className="estadistica-info">
            <h3>{estadisticas.vacunadas}</h3>
            <p>Vacunadas</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Filtros y Búsqueda */}
      <motion.div className="filtros-container" variants={itemVariants}>
        <div className="busqueda-container">
          <Search className="busqueda-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre de mascota o propietario..."
            value={filtros.busqueda}
            onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
            className="busqueda-input"
          />
        </div>

        <div className="filtros-opciones">
          <div className="filtro-grupo">
            <Filter size={16} />
            <select
              value={filtros.especie}
              onChange={(e) => setFiltros({ ...filtros, especie: e.target.value })}
              className="filtro-select"
            >
              <option value="todas">Todas las especies</option>
              <option value="perro">Perros</option>
              <option value="gato">Gatos</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Lista de Mascotas */}
      <motion.div className="mascotas-grid" variants={itemVariants}>
        <AnimatePresence>
          {mascotasFiltradas.map((mascota, index) => (
            <motion.div
              key={mascota.id}
              className="mascota-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              whileHover="hover"
              transition={{ delay: index * 0.1 }}
            >
              <div className="mascota-header">
                <div className="mascota-avatar">
                  {mascota.especie === "Perro" ? <Dog size={24} /> : <Cat size={24} />}
                </div>
                <div className="mascota-info-basica">
                  <h3>{mascota.nombre}</h3>
                  <p>{mascota.raza}</p>
                </div>
                <div className="mascota-acciones">
                  <motion.button
                    className="btn-accion ver"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => abrirModal(mascota)}
                  >
                    <Eye size={16} />
                  </motion.button>
                  <motion.button className="btn-accion editar" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Edit size={16} />
                  </motion.button>
                </div>
              </div>

              <div className="mascota-detalles">
                <div className="detalle-item">
                  <Weight size={16} />
                  <span>{mascota.peso}</span>
                </div>
                <div className="detalle-item">
                  <Calendar size={16} />
                  <span>{mascota.edad}</span>
                </div>
                <div className="detalle-item">
                  <Heart size={16} />
                  <span>{mascota.genero}</span>
                </div>
              </div>

              <div className="mascota-propietario">
                <p>
                  <strong>Propietario:</strong> {mascota.propietario_nombre}
                </p>
                <p>
                  <strong>Teléfono:</strong> {mascota.propietario_telefono}
                </p>
              </div>

              <div className="mascota-estado">
                <span className={`estado-badge ${mascota.vacunado ? "vacunado" : "no-vacunado"}`}>
                  <Shield size={12} />
                  {mascota.vacunado ? "Vacunado" : "Sin vacunar"}
                </span>
                <span className="ultima-consulta">Última consulta: {mascota.ultimaConsulta}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal de Detalles */}
      <AnimatePresence>
        {modalAbierto && mascotaSeleccionada && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrarModal}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>
                  {mascotaSeleccionada.especie === "Perro" ? <Dog size={24} /> : <Cat size={24} />}
                  {mascotaSeleccionada.nombre}
                </h2>
                <button className="btn-cerrar" onClick={cerrarModal}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="detalle-completo">
                  <div className="detalle-seccion">
                    <h4>Información Básica</h4>
                    <div className="detalle-grid">
                      <div>
                        <strong>Especie:</strong> {mascotaSeleccionada.especie}
                      </div>
                      <div>
                        <strong>Raza:</strong> {mascotaSeleccionada.raza}
                      </div>
                      <div>
                        <strong>Género:</strong> {mascotaSeleccionada.genero}
                      </div>
                      <div>
                        <strong>Edad:</strong> {mascotaSeleccionada.edad}
                      </div>
                      <div>
                        <strong>Peso:</strong> {mascotaSeleccionada.peso}
                      </div>
                      <div>
                        <strong>Color:</strong> {mascotaSeleccionada.color}
                      </div>
                    </div>
                  </div>

                  <div className="detalle-seccion">
                    <h4>Estado de Salud</h4>
                    <div className="detalle-grid">
                      <div>
                        <strong>Vacunado:</strong> {mascotaSeleccionada.vacunado ? "Sí" : "No"}
                      </div>
                      <div>
                        <strong>Estado Reproductivo:</strong> {mascotaSeleccionada.estadoReproductivo}
                      </div>
                      <div>
                        <strong>Última Consulta:</strong> {mascotaSeleccionada.ultimaConsulta}
                      </div>
                    </div>
                  </div>

                  <div className="detalle-seccion">
                    <h4>Propietario</h4>
                    <div className="detalle-grid">
                      <div>
                        <strong>Nombre:</strong> {mascotaSeleccionada.propietario_nombre}
                      </div>
                      <div>
                        <strong>Teléfono:</strong> {mascotaSeleccionada.propietario_telefono}
                      </div>
                    </div>
                  </div>

                  <div className="detalle-seccion">
                    <h4>Observaciones</h4>
                    <p>{mascotaSeleccionada.observaciones}</p>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-secundario" onClick={cerrarModal}>
                  Cerrar
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
    </motion.div>
  )
}

export default VetMascotas
