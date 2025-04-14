
import { useState } from "react"
import "../Estilos_F/Administrador.css"

// Datos de ejemplo para la tabla
const initialUsers = [
  { id: 1, name: "Carlos Rodríguez", email: "carlos@ejemplo.com" },
  { id: 2, name: "María López", email: "maria@ejemplo.com" },
  { id: 3, name: "Juan Pérez", email: "juan@ejemplo.com" },
  { id: 4, name: "Ana García", email: "ana@ejemplo.com" },
]

function Administrador() {
  const [users, setUsers] = useState(initialUsers)
  const [activeTab, setActiveTab] = useState("Inicio")
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "" })

  // Función para agregar un nuevo usuario
  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const newId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1
      setUsers([...users, { id: newId, name: newUser.name, email: newUser.email }])
      setNewUser({ name: "", email: "" })
      setShowAddUserForm(false)
    }
  }

  // Función para eliminar un usuario
  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo-container">
            <div className="admin-title">Pet Lovers</div>
          </div>
          <div className="admin-user-section">
            <div className="admin-avatar-wrapper">
              <img src="/placeholder.svg?height=32&width=32" alt="avatar" className="admin-avatar" />
              <span className="admin-doctor-name">Dr. Rodríguez</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="admin-sidebar">
        <h1>Menú</h1>
        <ul>
          {["Inicio", "Usuarios", "Veterinarios", "Roles"].map((item) => (
            <li key={item} onClick={() => setActiveTab(item)} className={activeTab === item ? "active" : ""}>
              {item}
            </li>
          ))}
        </ul>
      </nav>

      <main className="admin-main">
        <h1 className="admin-heading">Bienvenido al Panel de Administración</h1>

        <div className="admin-cards">
          <div className="card">
            <h4>Usuarios activos</h4>
            <p>7 / 10</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: "70%" }}></div>
            </div>
          </div>
          <div className="card">
            <h4>Usuarios registrados</h4>
            <p>{users.length} / 50</p>
            <div className="progress-bar green">
              <div className="progress" style={{ width: `${(users.length / 50) * 100}%` }}></div>
            </div>
          </div>
          <div className="card">
            <h4>Veterinarios activos</h4>
            <p>5 / 8</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: "62.5%" }}></div>
            </div>
          </div>
        </div>

        <div className="admin-form">
          <button className="admin-button" onClick={() => setShowAddUserForm(!showAddUserForm)}>
            {showAddUserForm ? "Cancelar" : "Agregar Usuario"}
          </button>
          <button className="admin-button">Actualizar Datos</button>
          <button className="admin-button">Asignación de Rol</button>
        </div>

        {showAddUserForm && (
          <div className="card" style={{ marginBottom: "20px" }}>
            <h4>Agregar Nuevo Usuario</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
              <input
                type="text"
                placeholder="Nombre"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
              <button className="admin-button" onClick={handleAddUser} style={{ alignSelf: "flex-start" }}>
                Guardar Usuario
              </button>
            </div>
          </div>
        )}

        <h3 className="admin-subheading">Usuarios Registrados</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button className="btn-edit">Editar</button>
                  <button className="btn-delete" onClick={() => handleDeleteUser(user.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}

export default Administrador
