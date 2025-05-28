import AdminLayout from "../Componentes/AdminLayout";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faCalendarAlt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import "../Estilos_F/FormUsu.css";

export default function RegistroUsu() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipoDocumento: 'CC',
    documento: '',
    nombre: '', // Cambiado a 'nombre' para coincidir con el backend
    fechaNacimiento: '',
    telefono: '',
    email: '',
    direccion: '',
    password: '', // Añadido campo de contraseña
    showPassword: false // Para alternar visibilidad de contraseña
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación en tiempo real para campos numéricos
    if (name === 'documento' || name === 'telefono') {
      if (!/^\d*$/.test(value)) return; // Solo permite números
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const togglePasswordVisibility = () => {
    setFormData({
      ...formData,
      showPassword: !formData.showPassword
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validación tipo documento
    if (!['CC', 'CE', 'PA'].includes(formData.tipoDocumento)) {
      newErrors.tipoDocumento = 'Seleccione un tipo de documento válido';
    }
    
    // Validación número de documento (8-10 dígitos)
    if (!/^\d{8,10}$/.test(formData.documento)) {
      newErrors.documento = 'El documento debe tener entre 8 y 10 dígitos';
    }
    
    // Validación nombre (mínimo 5 caracteres)
    if (formData.nombre.trim().length < 5) {
      newErrors.nombre = 'El nombre debe tener al menos 5 caracteres';
    }
    
    // Validación fecha de nacimiento (mayor de edad)
    const birthDate = new Date(formData.fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (!formData.fechaNacimiento || age < 18) {
      newErrors.fechaNacimiento = 'El usuario debe ser mayor de 18 años';
    }
    
    // Validación teléfono (exactamente 10 dígitos)
    if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener exactamente 10 dígitos';
    }
    
    // Validación email (formato correcto)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }
    
    // Validación dirección (mínimo 10 caracteres)
    if (!formData.direccion || formData.direccion.trim().length < 10) {
      newErrors.direccion = 'La dirección debe tener al menos 10 caracteres';
    }
    
    // Validación contraseña (mínimo 8 caracteres)
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/registro-Usuario', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tipoDocumento: formData.tipoDocumento,
          documento: formData.documento,
          nombre: formData.nombre, // Nombre del campo corregido
          fechaNacimiento: formData.fechaNacimiento,
          telefono: formData.telefono,
          email: formData.email,
          direccion: formData.direccion,
          password: formData.password
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al registrar el usuario');
      }

      const result = await res.json();
      alert('Usuario registrado exitosamente');
      navigate('/InicioAdmin');
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setErrors({
        ...errors,
        submit: error.message || 'Error al registrar el usuario'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="registro-container">
        <h2 className="titulo-formulario">Registro de usuarios</h2>
        
        <form onSubmit={handleSubmit} className="formulario-registro">
          {errors.submit && <div className="error-message">{errors.submit}</div>}
          
          <div className="form-row">
            <div className={`form-group ${errors.tipoDocumento ? 'has-error' : ''}`}>
              <label>Tipo de Documento *</label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="PA">Pasaporte</option>
              </select>
              {errors.tipoDocumento && <span className="error-text">{errors.tipoDocumento}</span>}
            </div>
            
            <div className={`form-group ${errors.documento ? 'has-error' : ''}`}>
              <label>Número de Documento *</label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                className="form-control"
                placeholder="Ej: 1234567890"
                maxLength="10"
                required
              />
              {errors.documento && <span className="error-text">{errors.documento}</span>}
            </div>
          </div>
          
          <div className={`form-group ${errors.nombre ? 'has-error' : ''}`}>
            <label>Nombre Completo *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="form-control"
              placeholder="Ej: Juan Pérez García"
              required
              minLength="5"
            />
            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
          </div>
          
          <div className="form-row">
            <div className={`form-group ${errors.fechaNacimiento ? 'has-error' : ''}`}>
              <label>Fecha de Nacimiento *</label>
              <div className="input-with-icon">
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className="form-control"
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  required
                />
                <FontAwesomeIcon icon={faCalendarAlt} className="input-icon" />
              </div>
              {errors.fechaNacimiento && <span className="error-text">{errors.fechaNacimiento}</span>}
            </div>
            
            <div className={`form-group ${errors.telefono ? 'has-error' : ''}`}>
              <label>Teléfono *</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="form-control"
                placeholder="Ej: 3001234567"
                maxLength="10"
                required
              />
              {errors.telefono && <span className="error-text">{errors.telefono}</span>}
            </div>
          </div>
          
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label>Correo Electrónico *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Ej: ejemplo@dominio.com"
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className={`form-group ${errors.direccion ? 'has-error' : ''}`}>
            <label>Dirección de residencia *</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="form-control"
              placeholder="Ej: calle 100 # 10-20"
              required
              minLength="10"
            />
            {errors.direccion && <span className="error-text">{errors.direccion}</span>}
          </div>

          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <label>Contraseña *</label>
            <div className="password-input-container">
              <input
                type={formData.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Mínimo 8 caracteres"
                required
                minLength="8"
              />
              <FontAwesomeIcon 
                icon={formData.showPassword ? faEyeSlash : faEye} 
                className="password-toggle-icon"
                onClick={togglePasswordVisibility}
              />
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={faSave} /> 
              {isSubmitting ? 'Registrando...' : 'Registrar Usuario'}
            </button>
            
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/InicioAdmin')}
            >
              <FontAwesomeIcon icon={faTimes} /> Cancelar
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}