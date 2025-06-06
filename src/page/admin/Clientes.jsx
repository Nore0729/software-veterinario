import "../../styles/Administrador/ClienteAdmin.css"
import AdminLayout from "../../layout/AdminLayout"
import { User, AtSign, Phone, Calendar, MapPin, FileText, Edit, Trash2, ToggleLeft, ToggleRight, Search, Plus } from "lucide-react"
import { useState } from "react"

function RegistroClientes() {
  // Datos quemados de clientes
  const [clientes, setClientes] = useState([
    {
      id: 1,
      tipoDocumento: "CC",
      documento: "123456789",
      nombreCompleto: "Juan Pérez Gómez",
      fechaNacimiento: "1985-05-15",
      telefono: "3001234567",
      email: "juan.perez@example.com",
      direccion: "Calle 123 #45-67, Bogotá",
      activo: true
    },
    {
      id: 2,
      tipoDocumento: "CE",
      documento: "AB123456",
      nombreCompleto: "María García López",
      fechaNacimiento: "1990-08-22",
      telefono: "3109876543",
      email: "maria.garcia@example.com",
      direccion: "Carrera 8 #12-34, Medellín",
      activo: false
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar clientes por búsqueda
  const filteredClientes = clientes.filter(cliente =>
    cliente.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.documento.includes(searchTerm)
  )

  // Cambiar estado del cliente
  const toggleEstado = (id) => {
    setClientes(clientes.map(cliente => 
      cliente.id === id ? { ...cliente, activo: !cliente.activo } : cliente
    ))
  }

  return (
    <AdminLayout>
      <div className="clientes-container">
        <div className="clientes-header">
          <h1>Registro de Clientes</h1>
          <div className="clientes-actions">
            <div className="search-bar">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Buscar cliente..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="clientes-table-container">
          <table className="clientes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Documento</th>
                <th>Nombre Completo</th>
                <th>Fecha Nacimiento</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>
                    <div className="documento-cell">
                      <span className="tipo-doc">{cliente.tipoDocumento}</span>
                      {cliente.documento}
                    </div>
                  </td>
                  <td>{cliente.nombreCompleto}</td>
                  <td>{new Date(cliente.fechaNacimiento).toLocaleDateString()}</td>
                  <td>
                    <div className="telefono-cell">
                      <Phone size={16} />
                      {cliente.telefono}
                    </div>
                  </td>
                  <td>
                    <div className="email-cell">
                      <AtSign size={16} />
                      {cliente.email}
                    </div>
                  </td>
                  <td>
                    <div className="direccion-cell">
                      <MapPin size={16} />
                      {cliente.direccion}
                    </div>
                  </td>
                  <td>
                    <button 
                      onClick={() => toggleEstado(cliente.id)}
                      className={`status-btn ${cliente.activo ? 'active' : 'inactive'}`}
                    >
                      {cliente.activo ? (
                        <ToggleRight size={20} />
                      ) : (
                        <ToggleLeft size={20} />
                      )}
                      {cliente.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="actions-cell">
                    <button className="btn-edit">
                      <Edit size={18} />
                    </button>
                    <button className="btn-delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default RegistroClientes; 


