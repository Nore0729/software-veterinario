"use client"

import { useState } from "react"
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Clock,
  User,
  Dog,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import "../styles/CitasVet.css"

const VeterinaryAppointments = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      petName: "Max",
      ownerName: "Juan Pérez",
      phone: "+34 666 123 456",
      email: "juan@email.com",
      date: "2024-01-15",
      time: "10:00",
      service: "Consulta General",
      status: "confirmed",
      notes: "Revisión rutinaria",
    },
    {
      id: 2,
      petName: "Luna",
      ownerName: "María García",
      phone: "+34 666 789 012",
      email: "maria@email.com",
      date: "2024-01-15",
      time: "11:30",
      service: "Vacunación",
      status: "pending",
      notes: "Primera vacuna",
    },
    {
      id: 3,
      petName: "Rocky",
      ownerName: "Carlos López",
      phone: "+34 666 345 678",
      email: "carlos@email.com",
      date: "2024-01-16",
      time: "09:00",
      service: "Cirugía Menor",
      status: "confirmed",
      notes: "Extracción de quiste",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showNewAppointment, setShowNewAppointment] = useState(false)

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed"
      case "pending":
        return "status-pending"
      case "completed":
        return "status-completed"
      case "cancelled":
        return "status-cancelled"
      default:
        return "status-default"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="status-icon" />
      case "pending":
        return <AlertCircle className="status-icon" />
      case "completed":
        return <CheckCircle className="status-icon" />
      case "cancelled":
        return <XCircle className="status-icon" />
      default:
        return <AlertCircle className="status-icon" />
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Variantes de animación
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

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(6, 182, 212, 0.15)",
      transition: { duration: 0.2 },
    },
  }

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const filterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2 },
    },
  }

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.3 },
    },
  }

  const emptyVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div className="appointments-container" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div className="appointments-header" variants={headerVariants}>
        <div className="appointments-header-content">
          <div className="appointments-title-container">
            <h1 className="appointments-title">Gestión de Citas</h1>
            <p className="appointments-subtitle">Administra las citas veterinarias</p>
          </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/citas" className="appointments-new-button">
            <Plus className="button-icon" />
            Nueva Cita
            </Link>
            </motion.div>

        </div>
      </motion.div>

      {/* Filters */}
      <motion.div className="appointments-filters" variants={filterVariants}>
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por mascota o propietario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <Filter className="filter-icon" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div className="stats-container" variants={statsVariants}>
        {[
          { label: "Total Citas", value: appointments.length, color: "stats-total" },
          {
            label: "Confirmadas",
            value: appointments.filter((a) => a.status === "confirmed").length,
            color: "stats-confirmed",
          },
          {
            label: "Pendientes",
            value: appointments.filter((a) => a.status === "pending").length,
            color: "stats-pending",
          },
          {
            label: "Hoy",
            value: appointments.filter((a) => a.date === new Date().toISOString().split("T")[0]).length,
            color: "stats-today",
          },
        ].map((stat, index) => (
          <motion.div key={stat.label} className="stats-card" variants={cardVariants} whileHover="hover">
            <div className={`stats-icon-container ${stat.color}`}>
              <Calendar className="stats-icon" />
            </div>
            <p className="stats-value">{stat.value}</p>
            <p className="stats-label">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Appointments List */}
      <motion.div className="appointments-list">
        <AnimatePresence>
          {filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              className="appointment-card-container"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -100 }}
              whileHover="hover"
              transition={{ delay: index * 0.1 }}
            >
              <div className="appointment-card">
                <div className="appointment-content">
                  <div className="appointment-info">
                    <div className="appointment-pet-info">
                      <div className="pet-avatar">
                        <Dog className="pet-icon" />
                      </div>
                      <div className="pet-details">
                        <h3 className="pet-name">{appointment.petName}</h3>
                        <p className="owner-name">
                          <User className="owner-icon" />
                          {appointment.ownerName}
                        </p>
                      </div>
                    </div>

                    <div className="appointment-details">
                      <div className="appointment-detail">
                        <Calendar className="detail-icon" />
                        <span>{new Date(appointment.date).toLocaleDateString("es-ES")}</span>
                      </div>
                      <div className="appointment-detail">
                        <Clock className="detail-icon" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="appointment-detail">
                        <Phone className="detail-icon" />
                        <span>{appointment.phone}</span>
                      </div>
                      <div className="appointment-detail">
                        <Mail className="detail-icon" />
                        <span>{appointment.email}</span>
                      </div>
                    </div>

                    <div className="appointment-badges">
                      <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        <span className="status-text">{appointment.status}</span>
                      </span>
                      <span className="service-badge">{appointment.service}</span>
                    </div>

                    {appointment.notes && (
                      <p className="appointment-notes">
                        <strong>Notas:</strong> {appointment.notes}
                      </p>
                    )}
                  </div>

                  <div className="appointment-actions">
                    <motion.button
                      className="action-button edit-button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit className="action-icon" />
                    </motion.button>
                    <motion.button
                      className="action-button delete-button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="action-icon" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredAppointments.length === 0 && (
        <motion.div className="empty-state" variants={emptyVariants}>
          <div className="empty-icon-container">
            <Calendar className="empty-icon" />
          </div>
          <h3 className="empty-title">No hay citas</h3>
          <p className="empty-message">No se encontraron citas que coincidan con los filtros aplicados.</p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default VeterinaryAppointments
