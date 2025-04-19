import { useState } from "react"
import "../Estilos_F/Administrador.css"

// Datos de ejemplo para la tabla
const initialUsers = [
  { id: 1, name: "Carlos Rodríguez", email: "carlos@ejemplo.com", role: "Administrador", status: "Activo", lastLogin: "2023-05-15 09:30" },
  { id: 2, name: "María López", email: "maria@ejemplo.com", role: "Veterinario", status: "Activo", lastLogin: "2023-05-14 14:45" },
  { id: 3, name: "Juan Pérez", email: "juan@ejemplo.com", role: "Usuario", status: "Inactivo", lastLogin: "2023-05-10 11:20" },
  { id: 4, name: "Ana García", email: "ana@ejemplo.com", role: "Usuario", status: "Activo", lastLogin: "2023-05-15 16:10" },
]

const roles = ["Administrador", "Veterinario", "Usuario", "Invitado"]
const statusOptions = ["Activo", "Inactivo", "Suspendido", "Pendiente"]

function Administrador() {
  const [users, setUsers] = useState(initialUsers)
  const [activeTab, setActiveTab] = useState("Inicio")
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Usuario", status: "Activo" })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState([])
  const [editUserId, setEditUserId] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    dateFrom: "",
    dateTo: ""
  })

  // Filtrar usuarios según término de búsqueda y filtros
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = !filters.role || user.role === filters.role
    const matchesStatus = !filters.status || user.status === filters.status
    
    // Filtro por fecha (simplificado)
    const matchesDate = true // Implementar lógica real según necesidades
    
    return matchesSearch && matchesRole && matchesStatus && matchesDate
  })

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const newId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1
      const userToAdd = {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        lastLogin: new Date().toISOString().slice(0, 16).replace("T", " ")
      }
      setUsers([...users, userToAdd])
      setNewUser({ name: "", email: "", role: "Usuario", status: "Activo" })
      setShowAddUserForm(false)
    }
  }

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id))
    setSelectedRows(selectedRows.filter(rowId => rowId !== id))
  }

  const handleDeleteSelected = () => {
    setUsers(users.filter(user => !selectedRows.includes(user.id)))
    setSelectedRows([])
  }

  const handleEditUser = (user) => {
    setEditUserId(user.id)
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    })
  }

  const handleUpdateUser = () => {
    setUsers(users.map(user => 
      user.id === editUserId ? {
        ...user,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status
      } : user
    ))
    setEditUserId(null)
    setNewUser({ name: "", email: "", role: "Usuario", status: "Activo" })
  }

  const handleSelectRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredUsers.map(user => user.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value
    })
  }

  const resetFilters = () => {
    setFilters({
      role: "",
      status: "",
      dateFrom: "",
      dateTo: ""
    })
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo-container">
            <div className="admin-title">Pet Lovers</div>
            <div className="admin-subtitle">Panel de Administración</div>
          </div>
          <div className="admin-user-section">
            <div className="admin-notification-bell">
              <span className="notification-badge">3</span>
              <i className="fas fa-bell"></i>
            </div>
            <div className="admin-avatar-wrapper">
              <img src="/placeholder.svg?height=32&width=32" alt="avatar" className="admin-avatar" />
              <div className="admin-user-info">
                <span className="admin-doctor-name">Dr. Rodríguez</span>
                <span className="admin-user-role">Administrador</span>
              </div>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>
      </header>

      <nav className="admin-sidebar">
        <div className="sidebar-header">
          <h1>Menú</h1>
        </div>
        <ul>
          {["Inicio", "Usuarios", "Veterinarios", "Roles", "Configuración", "Reportes", "Mensajes"].map((item) => (
            <li key={item} onClick={() => setActiveTab(item)} className={activeTab === item ? "active" : ""}>
              <i className={`fas ${
                item === "Inicio" ? "fa-home" :
                item === "Usuarios" ? "fa-users" :
                item === "Veterinarios" ? "fa-user-md" :
                item === "Roles" ? "fa-shield-alt" :
                item === "Configuración" ? "fa-cog" :
                item === "Reportes" ? "fa-chart-bar" :
                "fa-envelope"
              }`}></i>
              {item}
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <div className="system-status">
            <div className="status-indicator active"></div>
            <span>Sistema Operativo</span>
          </div>
        </div>
      </nav>

      <main className="admin-main">
        <div className="admin-header-actions">
          <h1 className="admin-heading">Bienvenido al Panel de Administración</h1>
          <div className="admin-search-bar">
            <input 
              type="text" 
              placeholder="Buscar usuarios..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <i className="fas fa-search"></i>
            </button>
            <button 
              className="filter-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fas fa-filter"></i> Filtros
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-row">
              <div className="filter-group">
                <label>Rol:</label>
                <select name="role" value={filters.role} onChange={handleFilterChange}>
                  <option value="">Todos</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Estado:</label>
                <select name="status" value={filters.status} onChange={handleFilterChange}>
                  <option value="">Todos</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="filter-row">
              <div className="filter-group">
                <label>Desde:</label>
                <input 
                  type="date" 
                  name="dateFrom" 
                  value={filters.dateFrom} 
                  onChange={handleFilterChange} 
                />
              </div>
              <div className="filter-group">
                <label>Hasta:</label>
                <input 
                  type="date" 
                  name="dateTo" 
                  value={filters.dateTo} 
                  onChange={handleFilterChange} 
                />
              </div>
              <button className="reset-filters" onClick={resetFilters}>
                Limpiar Filtros
              </button>
            </div>
          </div>
        )}

        <div className="admin-cards">
          <div className="card">
            <div className="card-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="card-content">
              <h4>Usuarios activos</h4>
              <p>7 / 10</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: "70%" }}></div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-icon">
              <i className="fas fa-user-plus"></i>
            </div>
            <div className="card-content">
              <h4>Usuarios registrados</h4>
              <p>{users.length} / 50</p>
              <div className="progress-bar green">
                <div className="progress" style={{ width: `${(users.length / 50) * 100}%` }}></div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="card-content">
              <h4>Veterinarios activos</h4>
              <p>5 / 8</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: "62.5%" }}></div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="card-content">
              <h4>Citas hoy</h4>
              <p>12</p>
              <div className="progress-bar blue">
                <div className="progress" style={{ width: "60%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form">
          <div className="action-buttons">
            <button className="admin-button primary" onClick={() => setShowAddUserForm(!showAddUserForm)}>
              <i className="fas fa-plus"></i> {showAddUserForm ? "Cancelar" : "Agregar Usuario"}
            </button>
            <button className="admin-button" onClick={() => alert("Función de actualización")}>
              <i className="fas fa-sync-alt"></i> Actualizar Datos
            </button>
            <button className="admin-button" onClick={() => alert("Función de asignación de roles")}>
              <i className="fas fa-shield-alt"></i> Asignación de Rol
            </button>
            {selectedRows.length > 0 && (
              <button className="admin-button danger" onClick={handleDeleteSelected}>
                <i className="fas fa-trash"></i> Eliminar Seleccionados ({selectedRows.length})
              </button>
            )}
          </div>
        </div>

        {(showAddUserForm || editUserId) && (
          <div className="card user-form-card">
            <h4>{editUserId ? "Editar Usuario" : "Agregar Nuevo Usuario"}</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button 
                className="admin-button primary" 
                onClick={editUserId ? handleUpdateUser : handleAddUser}
              >
                <i className="fas fa-save"></i> {editUserId ? "Actualizar" : "Guardar"} Usuario
              </button>
              {editUserId && (
                <button 
                  className="admin-button" 
                  onClick={() => {
                    setEditUserId(null)
                    setNewUser({ name: "", email: "", role: "Usuario", status: "Activo" })
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        )}

        <div className="table-header">
          <h3 className="admin-subheading">Usuarios Registrados</h3>
          <div className="table-actions">
            <span className="results-count">{filteredUsers.length} resultados</span>
            <button className="export-button">
              <i className="fas fa-file-export"></i> Exportar
            </button>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedRows.length === filteredUsers.length && filteredUsers.length > 0}
                  />
                </th>
                <th>ID <i className="fas fa-sort"></i></th>
                <th>Nombre <i className="fas fa-sort"></i></th>
                <th>Correo <i className="fas fa-sort"></i></th>
                <th>Rol <i className="fas fa-sort"></i></th>
                <th>Estado</th>
                <th>Último acceso <i className="fas fa-sort"></i></th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={user.status.toLowerCase()}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedRows.includes(user.id)}
                        onChange={() => handleSelectRow(user.id)}
                      />
                    </td>
                    <td>{user.id}</td>
                    <td>
                      <div className="user-cell">
                        <img src="/placeholder.svg?height=32&width=32" alt="avatar" className="user-avatar" />
                        {user.name}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.lastLogin}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEditUser(user)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteUser(user.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                        <button className="btn-more">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-results">
                    <i className="fas fa-exclamation-circle"></i> No se encontraron usuarios que coincidan con los criterios de búsqueda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-controls">
          <button className="pagination-button" disabled>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="pagination-button active">1</button>
          <button className="pagination-button">2</button>
          <button className="pagination-button">3</button>
          <button className="pagination-button">
            <i className="fas fa-chevron-right"></i>
          </button>
          <div className="page-size-selector">
            <span>Mostrar:</span>
            <select>
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span>por página</span>
          </div>
        </div>
      </main>

      <div className="admin-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span>© 2023 Pet Lovers - Sistema de Administración</span>
          </div>
          <div className="footer-right">
            <span>Versión 2.1.0</span>
            <span className="divider">|</span>
            <a href="#">Ayuda</a>
            <span className="divider">|</span>
            <a href="#">Términos</a>
            <span className="divider">|</span>
            <a href="#">Privacidad</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Administrador
