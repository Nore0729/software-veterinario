import "../../styles/Administrador/ClienteAdmin.css"
import AdminLayout from "../../layout/AdminLayout"
import { User, AtSign, Phone, Calendar, MapPin, FileText, Edit, Trash2, ToggleLeft, ToggleRight, Search, Plus } from "lucide-react"
import { useState } from "react"

function RegistroClientes() {
  // Datos quemados de clientes
  const [clientes, setClientes] = useState([
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
                <th style={{ color: 'white' }}>ID</th>
                <th style={{ color: 'white' }}>Documento</th>
                <th style={{ color: 'white' }}>Nombre Completo</th>
                <th style={{ color: 'white' }}>Fecha Nacimiento</th>
                <th style={{ color: 'white' }}>Teléfono</th>
                <th style={{ color: 'white' }}>Email</th>
                <th style={{ color: 'white' }}>Dirección</th>
                <th style={{ color: 'white' }}>Estado</th>
                <th style={{ color: 'white' }}>Acciones</th>
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


