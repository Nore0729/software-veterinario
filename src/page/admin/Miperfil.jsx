import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Administrador/Miperfil.css';
import AdminLayout from '../../layout/AdminLayout';
import {
  FaArrowLeft, FaUserEdit, FaSave, FaTimes,
  FaLock, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheckCircle
} from 'react-icons/fa';

function PerfilAdministrador() {
  const navigate = useNavigate();
  const [modoEdicion, setModoEdicion] = useState(false);

  const [adminData, setAdminData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    nuevaContrasena: '',
    confirmarContrasena: '',
    imagenPerfil: null,
    ultimaConexion: '',
    emailVerificado: true,
  });

  useEffect(() => {
    const datos = {
      nombre: localStorage.getItem('nombre') || 'Administrador Ejemplo',
      email: localStorage.getItem('email') || 'admin@vet.com',
      telefono: '3214567890',
      direccion: 'Calle 123 #45-67',
      ultimaConexion: '2025-06-27 12:45',
      emailVerificado: true,
      imagenPerfil: null,
    };
    setAdminData(prev => ({ ...prev, ...datos }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
  };

  const handleImagenPerfil = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAdminData(prev => ({ ...prev, imagenPerfil: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const verificarSeguridadContrasena = (pass) => {
    const lengthOk = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    return lengthOk && hasUpper && hasNumber;
  };

  const handleGuardar = () => {
    if (
      adminData.nuevaContrasena &&
      adminData.nuevaContrasena !== adminData.confirmarContrasena
    ) {
      alert('❌ Las contraseñas no coinciden');
      return;
    }

    // Aquí enviarías los datos al backend
    console.log('Datos actualizados:', adminData);
    alert('✅ Perfil actualizado correctamente');
    setModoEdicion(false);
  };

  const volverAlMenu = () => {
    navigate('/inicioadmin');
  };

  return (
    <AdminLayout>
      <div className="perfil-administrador-container">
        <div className="perfil-headerr">
          <button onClick={volverAlMenu} className="btn-volver">
            <FaArrowLeft /> Volver al Menú
          </button>
          <h2>Mi Perfil de Administrador</h2>
        </div>

        <div className="perfil-contenido">
          <div className="perfil-administrador">
            <label htmlFor="uploadFoto" className="avatar-editable">
              {adminData.imagenPerfil ? (
                <img src={adminData.imagenPerfil} alt="Perfil-admin" className="avatar-img" />
              ) : (
                <div className="avatar-admin">
                  {adminData.nombre.charAt(0).toUpperCase()}
                </div>
              )}
            </label>
            {modoEdicion && (
              <input
                id="uploadFoto"
                type="file"
                accept="image/*"
                onChange={handleImagenPerfil}
                style={{ display: 'none' }}
              />
            )}
            <h3>{adminData.nombre}</h3>
            <p>
              Administrador del Sistema{' '}
              {adminData.emailVerificado && (
                <span className="verificado">
                  <FaCheckCircle /> Verificado
                </span>
              )}
            </p>
            <small>Última conexión: {adminData.ultimaConexion}</small>
          </div>

          <div className="perfil-formulario">
            <div className="campos-form">
              <label><FaUserEdit /> Nombre:</label>
              <input
                name="nombre"
                type="text"
                value={adminData.nombre}
                onChange={handleChange}
                disabled={!modoEdicion}
              />
            </div>

            <div className="campos-form">
              <label><FaEnvelope /> Correo electrónico:</label>
              <input
                name="email"
                type="email"
                value={adminData.email}
                onChange={handleChange}
                disabled={!modoEdicion}
              />
            </div>

            <div className="campos-form">
              <label><FaPhone /> Teléfono:</label>
              <input
                name="telefono"
                type="text"
                value={adminData.telefono}
                onChange={handleChange}
                disabled={!modoEdicion}
              />
            </div>

            <div className="campos-form">
              <label><FaMapMarkerAlt /> Dirección:</label>
              <input
                name="direccion"
                type="text"
                value={adminData.direccion}
                onChange={handleChange}
                disabled={!modoEdicion}
              />
            </div>

            {modoEdicion && (
              <>
                <div className="campos-form">
                  <label><FaLock /> Nueva Contraseña:</label>
                  <input
                    name="nuevaContrasena"
                    type="password"
                    value={adminData.nuevaContrasena}
                    onChange={handleChange}
                    placeholder="Dejar en blanco para no cambiar"
                  />
                  {adminData.nuevaContrasena && (
                    <div className="seguridad-contraseña">
                      Seguridad:{' '}
                      <strong style={{
                        color: verificarSeguridadContrasena(adminData.nuevaContrasena)
                          ? 'green'
                          : 'red'
                      }}>
                        {verificarSeguridadContrasena(adminData.nuevaContrasena)
                          ? 'Buena'
                          : 'Débil'}
                      </strong>
                    </div>
                  )}
                </div>

                <div className="campos-form">
                  <label><FaLock /> Confirmar Contraseña:</label>
                  <input
                    name="confirmarContrasena"
                    type="password"
                    value={adminData.confirmarContrasena}
                    onChange={handleChange}
                    placeholder="Repite la nueva contraseña"
                  />
                </div>
              </>
            )}

            <div className="perfil-botones">
              {modoEdicion ? (
                <>
                  <button onClick={handleGuardar} className="guardar">
                    <FaSave /> Guardar Cambios
                  </button>
                  <button className="cancelar" onClick={() => setModoEdicion(false)}>
                    <FaTimes /> Cancelar
                  </button>
                </>
              ) : (
                <button onClick={() => setModoEdicion(true)} className="editar">
                  <FaUserEdit /> Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default PerfilAdministrador;
