import AdminLayout from "../Componentes/AdminLayout"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import "../Estilos_F/FormUsu.css"

export default function RegistroUsu() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  tipoDocumento: 'CC',
  documento: '',
  nombreCompleto: '',
  fechaNacimiento: '',
  telefono: '',
  email: ''
});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const docRegex = /^[0-9a-zA-Z]{5,20}$/;

    if (!formData.tipoDocumento) newErrors.tipoDocumento = 'Seleccione un tipo de documento';
    if (!formData.documento.match(docRegex)) newErrors.documento = 'Documento inválido';
    if (formData.nombreCompleto.length < 5) newErrors.nombreCompleto = 'Nombre demasiado corto';
    
    const today = new Date();
    const birthDate = new Date(formData.fechaNacimiento);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (!formData.fechaNacimiento || age < 18) newErrors.fechaNacimiento = 'Debe ser mayor de edad';
    
    if (!formData.telefono.match(phoneRegex)) newErrors.telefono = 'Teléfono inválido';
    if (!formData.email.match(emailRegex)) newErrors.email = 'Email inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
  const res = await fetch('/api/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error en la respuesta del servidor:", errorText);
    alert("Error al registrar el usuario: " + errorText);
    return;
  }

  const result = await res.text(); // o .json() si devuelves JSON en el backend
           alert(result);
         } catch (error) {
           console.error("Error al enviar solicitud:", error);
           alert("Error de red o del servidor");
         }finally {
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
              />
              {errors.documento && <span className="error-text">{errors.documento}</span>}
            </div>
          </div>
          
          <div className={`form-group ${errors.nombreCompleto ? 'has-error' : ''}`}>
            <label>Nombre Completo *</label>
            <input
              type="text"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              className="form-control"
              placeholder="Ej: Juan Pérez García"
            />
            {errors.nombreCompleto && <span className="error-text">{errors.nombreCompleto}</span>}
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
                  max={new Date().toISOString().split('T')[0]}
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
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
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