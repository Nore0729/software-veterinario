"use client"

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, User, Dog, Phone, Mail, Plus, Search, Filter,
  Edit, Trash2, CheckCircle, XCircle, AlertCircle,
} from "lucide-react";
import Swal from 'sweetalert2';
import "../styles/CitasVet.css";

const VeterinaryAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/citasvet');
        if (!response.ok) {
          throw new Error('No se pudieron cargar las citas.');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error al cargar las citas:", error);
        Swal.fire('Error', 'No se pudieron cargar los datos de las citas.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    const originalAppointments = [...appointments];
    
    const updatedAppointments = appointments.map(app => 
        app.id === appointmentId ? { ...app, status: newStatus } : app
    );
    setAppointments(updatedAppointments);

    try {
        const response = await fetch(`/api/citasvet/${appointmentId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            Swal.fire('Error', 'No se pudo actualizar el estado en el servidor.', 'error');
            setAppointments(originalAppointments);
        }
    } catch (error) {
        console.error("Error actualizando estado:", error);
        Swal.fire('Error', 'Error de conexión al actualizar el estado.', 'error');
        setAppointments(originalAppointments);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmada": return "status-confirmed";
      case "pendiente": return "status-pending";
      case "completada": return "status-completed";
      case "cancelada": return "status-cancelled";
      default: return "status-default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmada": return <CheckCircle className="status-icon" />;
      case "pendiente": return <AlertCircle className="status-icon" />;
      case "completada": return <CheckCircle className="status-icon" />;
      case "cancelada": return <XCircle className="status-icon" />;
      default: return <AlertCircle className="status-icon" />;
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const searchLower = searchTerm.toLowerCase();
    const statusLower = appointment.status.toLowerCase();
    const matchesSearch =
      appointment.petName.toLowerCase().includes(searchLower) ||
      appointment.ownerName.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === "all" || statusLower === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const cardVariants = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { ease: "easeOut" } }, hover: { y: -5, scale: 1.02, boxShadow: "0 10px 25px rgba(6, 182, 212, 0.15)" } };
  const headerVariants = { hidden: { y: -50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { ease: "easeOut" } } };
  const filterVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2 } } };
  const statsVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3 } } };
  const emptyVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  if (loading) {
    return (
      <div className="appointments-container">
        <h2 className="loading-message">Cargando Citas...</h2>
      </div>
    );
  }

  return (
    <motion.div className="appointments-container" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="appointments-header" variants={headerVariants}>
        <div className="appointments-header-content">
            <div className="appointments-title-container"><h1 className="appointments-title">Gestión de Citas</h1><p className="appointments-subtitle">Administra las citas veterinarias</p></div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Link to="/citas" className="appointments-new-button"><Plus className="button-icon" />Nueva Cita</Link></motion.div>
        </div>
      </motion.div>

      <motion.div className="appointments-filters" variants={filterVariants}>
        <div className="search-container"><Search className="search-icon" /><input type="text" placeholder="Buscar por mascota o propietario..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input"/></div>
        <div className="filter-container"><Filter className="filter-icon" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select"><option value="all">Todos los estados</option><option value="pendiente">Pendiente</option><option value="confirmada">Confirmada</option><option value="completada">Completada</option><option value="cancelada">Cancelada</option></select></div>
      </motion.div>

      <motion.div className="stats-container" variants={statsVariants}>
        {[
          { label: "Total Citas", value: appointments.length, color: "stats-total" },
          { label: "Confirmadas", value: appointments.filter((a) => a.status === "Confirmada").length, color: "stats-confirmed" },
          { label: "Pendientes", value: appointments.filter((a) => a.status === "Pendiente" || a.status === "Programada").length, color: "stats-pending" },
          { label: "Hoy", value: appointments.filter((a) => a.date === new Date().toISOString().split("T")[0]).length, color: "stats-today" },
        ].map((stat) => (
          <motion.div key={stat.label} className="stats-card" variants={cardVariants} whileHover="hover">
            <div className={`stats-icon-container ${stat.color}`}><Calendar className="stats-icon" /></div>
            <p className="stats-value">{stat.value}</p>
            <p className="stats-label">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="appointments-list">
        <AnimatePresence>
          {filteredAppointments.map((appointment, index) => (
            <motion.div key={appointment.id} className="appointment-card-container" variants={cardVariants} initial="hidden" animate="visible" exit={{ opacity: 0, x: -100 }} whileHover="hover" transition={{ delay: index * 0.1 }}>
              <div className="appointment-card">
                <div className="appointment-content">
                  <div className="appointment-info">
                    <div className="appointment-pet-info"><div className="pet-avatar"><Dog className="pet-icon" /></div><div className="pet-details"><h3 className="pet-name">{appointment.petName}</h3><p className="owner-name"><User className="owner-icon" />{appointment.ownerName}</p></div></div>
                    <div className="appointment-details">
                      <div className="appointment-detail"><Calendar className="detail-icon" /><span>{new Date(appointment.date).toLocaleDateString("es-ES")}</span></div>
                      <div className="appointment-detail"><Clock className="detail-icon" /><span>{appointment.time}</span></div>
                      <div className="appointment-detail"><Phone className="detail-icon" /><span>{appointment.phone}</span></div>
                      <div className="appointment-detail"><Mail className="detail-icon" /><span>{appointment.email}</span></div>
                    </div>
                    <div className="appointment-badges">
                      <div className={`status-badge-container ${getStatusClass(appointment.status.toLowerCase())}`}>
                        {getStatusIcon(appointment.status.toLowerCase())}
                        <select 
                          value={appointment.status} 
                          className="status-select"
                          onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Confirmada">Confirmada</option>
                          <option value="Completada">Completada</option>
                          <option value="Cancelada">Cancelada</option>
                        </select>
                      </div>
                      <span className="service-badge">{appointment.service}</span>
                    </div>
                    {appointment.notes && (<p className="appointment-notes"><strong>Notas:</strong> {appointment.notes}</p>)}
                  </div>
                  <div className="appointment-actions">
                    <motion.button className="action-button edit-button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><Edit className="action-icon" /></motion.button>
                    <motion.button className="action-button delete-button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><Trash2 className="action-icon" /></motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredAppointments.length === 0 && (
        <motion.div className="empty-state" variants={emptyVariants}>
          <div className="empty-icon-container"><Calendar className="empty-icon" /></div>
          <h3 className="empty-title">No hay citas</h3>
          <p className="empty-message">No se encontraron citas que coincidan con los filtros aplicados.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VeterinaryAppointments;