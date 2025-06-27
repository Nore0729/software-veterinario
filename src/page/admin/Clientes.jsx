import "../../styles/Administrador/ClienteAdmin.css"
import AdminLayout from "../../layout/AdminLayout"
import { Phone, AtSign, MapPin, Edit, Trash2, ToggleLeft, ToggleRight, Search, X } from "lucide-react"
import { useEffect, useState } from "react"

const API_BASE_URL = "http://localhost:3000";

function RegistroClientes() {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteActual, setClienteActual] = useState(null);

  const [formEdit, setFormEdit] = useState({
    nombre: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    direccion: ""
  });

  const cargarClientes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/odtener_clientes`);
      const data = await res.json();
      const formateados = data.map(c => ({
        id: c.id,
        tipoDocumento: c.tipo_Doc,
        documento: c.doc,
        nombreCompleto: c.nombre,
        fechaNacimiento: c.fecha_Nac,
        telefono: c.tel,
        email: c.email,
        direccion: c.direccion,
        activo: true,
      }));
      setClientes(formateados);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const abrirModalEdicion = (cliente) => {
    setClienteActual(cliente);
    setFormEdit({
      nombre: cliente.nombreCompleto,
      fechaNacimiento: cliente.fechaNacimiento,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion
    });
    setModalVisible(true);
  };

  const guardarCambios = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/actualizar_cliente/${clienteActual.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formEdit.nombre,
          fecha_Nac: formEdit.fechaNacimiento,
          tel: formEdit.telefono,
          email: formEdit.email,
          direccion: formEdit.direccion,
        })
      });

      if (!res.ok) throw new Error("Error al actualizar cliente");
      alert("Cliente actualizado con éxito");
      setModalVisible(false);
      cargarClientes();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar cambios");
    }
  };

  const filteredClientes = clientes.filter(c =>
    c.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.documento.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="clientes">
        <div className="clientes_prin">
          <h1>Gestión de Clientes</h1>
          <div className="clientes-acciones">
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

        <div className="clientes-tabla">
          <table className="clientes-tabla1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Documento</th>
                <th>Nombre</th>
                <th>Nacimiento</th>
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
                  <td>{cliente.tipoDocumento} {cliente.documento}</td>
                  <td>{cliente.nombreCompleto}</td>
                  <td>{new Date(cliente.fechaNacimiento).toLocaleDateString()}</td>
                  <td><Phone size={16} /> {cliente.telefono}</td>
                  <td><AtSign size={16} /> {cliente.email}</td>
                  <td><MapPin size={16} /> {cliente.direccion}</td>
                  <td>
                    <button className={`status-btn ${cliente.activo ? 'active' : 'inactive'}`}>
                      {cliente.activo ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      {cliente.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td>
                    <button className="btn-editar" onClick={() => abrirModalEdicion(cliente)}>
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL EDICIÓN */}
        {modalVisible && (
            <div className="actualizar">
              <div className="form_actualizar">
                <button className="botons-close" onClick={() => setModalVisible(false)}>
                  <X size={20} />
                </button>

                {/* Columna izquierda: Logo y nombre */}
                <div className="menu">
                  <img src="https://raw.githubusercontent.com/Nore0729/Img-soft-veterinario/refs/heads/main/GuzPet.png" alt="Logo Veterinaria" />
                  <h3>Pet Lovers</h3>
                </div>

                {/* Columna derecha: Formulario */}
                <div className="formulario">
                  <h2>Editar Cliente</h2>
                  <div className="campo1">
                    <label>Nombre completo:</label>
                    <input value={formEdit.nombre} onChange={e => setFormEdit({ ...formEdit, nombre: e.target.value })} />
                  </div>
                  <div className="campo2">
                    <label>Fecha de nacimiento:</label>
                    <input type="date" value={formEdit.fechaNacimiento} onChange={e => setFormEdit({ ...formEdit, fechaNacimiento: e.target.value })} />
                  </div>
                  <div className="campo3">
                    <label>Teléfono:</label>
                    <input value={formEdit.telefono} onChange={e => setFormEdit({ ...formEdit, telefono: e.target.value })} />
                  </div>
                  <div className="campo4">
                    <label>Email:</label>
                    <input type="email" value={formEdit.email} onChange={e => setFormEdit({ ...formEdit, email: e.target.value })} />
                  </div>
                  <div className="campo5">
                    <label>Dirección:</label>
                    <input value={formEdit.direccion} onChange={e => setFormEdit({ ...formEdit, direccion: e.target.value })} />
                  </div>
                  <button className="guardra_cambios" onClick={guardarCambios}>
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          )}

      </div>
    </AdminLayout>
  );
}

export default RegistroClientes;

