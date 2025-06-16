"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Phone,
  Mail,
  Dog,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  XCircle,
  Heart,
  Activity,
  Edit,
  Eye,
} from "lucide-react"
import "../styles/UsuarioVet.css"

const OwnersList = () => {
  // Datos de ejemplo de propietarios y sus mascotas
  const [ownersData] = useState([
    {
      id: 1,
      name: "Juan Pérez García",
      phone: "+34 666 123 456",
      email: "juan.perez@email.com",
      address: "Calle Mayor 123, 28001 Madrid",
      emergencyContact: "+34 666 789 012",
      registrationDate: "2023-01-15",
      pets: [
        {
          id: 1,
          name: "Max",
          species: "Perro",
          breed: "Golden Retriever",
          age: "3 años",
          weight: "28 kg",
          gender: "Macho",
          photo: "/placeholder.svg?height=80&width=80",
          nextAppointment: {
            date: "2024-01-20",
            time: "10:00",
            service: "Consulta General",
            status: "pending",
          },
          pendingAppointments: 1,
          lastVisit: "2024-01-15",
        },
        {
          id: 2,
          name: "Bella",
          species: "Gato",
          breed: "Persa",
          age: "2 años",
          weight: "4 kg",
          gender: "Hembra",
          photo: "/placeholder.svg?height=80&width=80",
          nextAppointment: null,
          pendingAppointments: 0,
          lastVisit: "2023-12-10",
        },
      ],
    },
    {
      id: 2,
      name: "María García López",
      phone: "+34 666 789 012",
      email: "maria.garcia@email.com",
      address: "Avenida Libertad 45, 28002 Madrid",
      emergencyContact: "+34 666 456 789",
      registrationDate: "2023-03-20",
      pets: [
        {
          id: 3,
          name: "Luna",
          species: "Perro",
          breed: "Labrador",
          age: "1 año",
          weight: "22 kg",
          gender: "Hembra",
          photo: "/placeholder.svg?height=80&width=80",
          nextAppointment: {
            date: "2024-01-18",
            time: "11:30",
            service: "Vacunación",
            status: "pending",
          },
          pendingAppointments: 1,
          lastVisit: "2024-01-10",
        },
      ],
    },
    {
      id: 3,
      name: "Carlos López Martín",
      phone: "+34 666 345 678",
      email: "carlos.lopez@email.com",
      address: "Plaza España 12, 28003 Madrid",
      emergencyContact: "+34 666 123 789",
      registrationDate: "2022-11-08",
      pets: [
        {
          id: 4,
          name: "Rocky",
          species: "Perro",
          breed: "Pastor Alemán",
          age: "5 años",
          weight: "35 kg",
          gender: "Macho",
          photo: "/placeholder.svg?height=80&width=80",
          nextAppointment: {
            date: "2024-01-22",
            time: "09:00",
            service: "Cirugía Menor",
            status: "confirmed",
          },
          pendingAppointments: 1,
          lastVisit: "2024-01-05",
        },
        {
          id: 5,
          name: "Mia",
          species: "Gato",
          breed: "Siamés",
          age: "4 años",
          weight: "3.5 kg",
          gender: "Hembra",
          photo: "/placeholder.svg?height=80&width=80",
          nextAppointment: null,
          pendingAppointments: 0,
          lastVisit: "2023-11-20",
        },
        {
          id: 6,
          name: "Thor",
          species: "Perro",
          breed: "Rottweiler",
          age: "6 años",
          weight: "45 kg",
          gender: "Macho",
          photo: "/placeholder.svg?height=80&width=80",
          nextAppointment: {
            date: "2024-01-25",
            time: "16:00",
            service: "Consulta General",
            status: "pending",
          },
          pendingAppointments: 1,
          lastVisit: "2023-12-15",
        },
      ],
    },
    {
      id: 4,
      name: "Ana Rodríguez Silva",
      phone: "+34 666 987 654",
      email: "ana.rodriguez@email.com",
      address: "Calle Alcalá 78, 28004 Madrid",
      emergencyContact: "+34 666 321 987",
      registrationDate: "2023-06-12",
      pets: [
        {
          id: 7,
          name: "Coco",
          species: "Conejo",
          breed: "Holandés",
          age: "2 años",
          weight: "1.8 kg",
          gender: "Macho",
          photo: "/placeholder.svg?height=80&width=80",
          nextAppointment: null,
          pendingAppointments: 0,
          lastVisit: "2023-12-20",
        },
      ],
    },
  ])

  const [expandedOwners, setExpandedOwners] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const toggleOwnerExpansion = (ownerId) => {
    const newExpanded = new Set(expandedOwners)
    if (newExpanded.has(ownerId)) {
      newExpanded.delete(ownerId)
    } else {
      newExpanded.add(ownerId)
    }
    setExpandedOwners(newExpanded)
  }

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

  const filteredOwners = ownersData.filter((owner) => {
    const matchesSearch =
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.pets.some((pet) => pet.name.toLowerCase().includes(searchTerm.toLowerCase()))

    if (filterStatus === "all") return matchesSearch
    if (filterStatus === "with-appointments") {
      return matchesSearch && owner.pets.some((pet) => pet.pendingAppointments > 0)
    }
    if (filterStatus === "no-appointments") {
      return matchesSearch && owner.pets.every((pet) => pet.pendingAppointments === 0)
    }
    return matchesSearch
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

  const totalPets = ownersData.reduce((sum, owner) => sum + owner.pets.length, 0)
  const totalPendingAppointments = ownersData.reduce(
    (sum, owner) => sum + owner.pets.reduce((petSum, pet) => petSum + pet.pendingAppointments, 0),
    0,
  )

  return (
    <motion.div className="owners-container" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div className="owners-header" variants={headerVariants}>
        <div className="owners-header-content">
          <div className="owners-title-container">
            <h1 className="owners-title">Propietarios y Mascotas</h1>
            <p className="owners-subtitle">Gestiona la información de todos los propietarios y sus mascotas</p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div className="owners-filters" variants={filterVariants}>
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por propietario, email o mascota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <Filter className="filter-icon" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="all">Todos los propietarios</option>
            <option value="with-appointments">Con citas pendientes</option>
            <option value="no-appointments">Sin citas pendientes</option>
          </select>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div className="stats-container" variants={statsVariants}>
        {[
          { label: "Total Propietarios", value: ownersData.length, color: "stats-owners" },
          { label: "Total Mascotas", value: totalPets, color: "stats-pets" },
          { label: "Citas Pendientes", value: totalPendingAppointments, color: "stats-pending" },
          {
            label: "Activos Hoy",
            value: ownersData.filter((owner) =>
              owner.pets.some(
                (pet) => pet.nextAppointment && pet.nextAppointment.date === new Date().toISOString().split("T")[0],
              ),
            ).length,
            color: "stats-today",
          },
        ].map((stat, index) => (
          <motion.div key={stat.label} className="stats-card" variants={cardVariants} whileHover="hover">
            <div className={`stats-icon-container ${stat.color}`}>
              <User className="stats-icon" />
            </div>
            <p className="stats-value">{stat.value}</p>
            <p className="stats-label">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Owners List */}
      <motion.div className="owners-list">
        <AnimatePresence>
          {filteredOwners.map((owner, index) => {
            const isExpanded = expandedOwners.has(owner.id)
            const totalPendingForOwner = owner.pets.reduce((sum, pet) => sum + pet.pendingAppointments, 0)

            return (
              <motion.div
                key={owner.id}
                className="owner-card-container"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -100 }}
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
              >
                <div className="owner-card">
                  {/* Owner Header */}
                  <div className="owner-header" onClick={() => toggleOwnerExpansion(owner.id)}>
                    <div className="owner-info">
                      <div className="owner-avatar">
                        <User className="owner-avatar-icon" />
                      </div>
                      <div className="owner-details">
                        <h3 className="owner-name">{owner.name}</h3>
                        <p className="owner-summary">
                          {owner.pets.length} mascota{owner.pets.length !== 1 ? "s" : ""}
                          {totalPendingForOwner > 0 && (
                            <span className="pending-indicator">
                              • {totalPendingForOwner} cita{totalPendingForOwner !== 1 ? "s" : ""} pendiente
                              {totalPendingForOwner !== 1 ? "s" : ""}
                            </span>
                          )}
                        </p>
                        <div className="owner-contact">
                          <Phone className="contact-icon" />
                          <span>{owner.phone}</span>
                          <Mail className="contact-icon" />
                          <span>{owner.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="owner-actions">
                      <div className="pets-count">
                        <Dog className="pets-icon" />
                        <span>{owner.pets.length}</span>
                      </div>
                      <motion.div
                        className="expand-button"
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight className="expand-icon" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Pets List (Expandable) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="pets-section"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <div className="pets-header">
                          <h4 className="pets-title">Mascotas de {owner.name.split(" ")[0]}</h4>
                        </div>

                        <div className="pets-grid">
                          {owner.pets.map((pet) => (
                            <motion.div
                              key={pet.id}
                              className="pet-card"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="pet-photo-container">
                                <img src={pet.photo || "/placeholder.svg"} alt={pet.name} className="pet-photo" />
                                {pet.pendingAppointments > 0 && <div className="pet-notification-dot"></div>}
                              </div>

                              <div className="pet-info">
                                <h5 className="pet-name">{pet.name}</h5>
                                <p className="pet-breed">
                                  {pet.breed} • {pet.age}
                                </p>

                                <div className="pet-stats">
                                  <span className="pet-stat">
                                    <Heart className="pet-stat-icon" />
                                    {pet.weight}
                                  </span>
                                  <span className="pet-stat">
                                    <Activity className="pet-stat-icon" />
                                    {pet.gender}
                                  </span>
                                </div>

                                {pet.nextAppointment ? (
                                  <div className="next-appointment">
                                    <div className="appointment-info">
                                      <Calendar className="appointment-icon" />
                                      <span className="appointment-date">
                                        {new Date(pet.nextAppointment.date).toLocaleDateString("es-ES")}
                                      </span>
                                      <Clock className="appointment-icon" />
                                      <span className="appointment-time">{pet.nextAppointment.time}</span>
                                    </div>
                                    <span className={`status-badge ${getStatusClass(pet.nextAppointment.status)}`}>
                                      {getStatusIcon(pet.nextAppointment.status)}
                                      {pet.nextAppointment.service}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="no-appointment">
                                    <span className="last-visit">
                                      Última visita: {new Date(pet.lastVisit).toLocaleDateString("es-ES")}
                                    </span>
                                  </div>
                                )}

                                <div className="pet-actions">
                                  <motion.button
                                    className="pet-action-button view-button"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Eye className="action-icon" />
                                  </motion.button>
                                  <motion.button
                                    className="pet-action-button edit-button"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Edit className="action-icon" />
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {filteredOwners.length === 0 && (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="empty-icon-container">
            <User className="empty-icon" />
          </div>
          <h3 className="empty-title">No se encontraron propietarios</h3>
          <p className="empty-message">No hay propietarios que coincidan con los filtros aplicados.</p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default OwnersList
