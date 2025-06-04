import AdminLayout from "../Componentes/AdminLayout"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTimes, faCalendarAlt, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import "../Estilos_F/FormUsu.css"

export default function RegistroUsu() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    tipo_Doc: "CC", // Cambiado de tipoDocumento
    doc: "", // Cambiado de documento
    nombre: "",
    fecha_Nac: "", // Cambiado de fechaNacimiento
    tel: "", // Cambiado de telefono
    email: "",
    direccion: "",
    password: "",
    showPassword: false,
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    // Procesamiento específico por campo
    let processedValue = value

    switch (name) {
      case "doc":
        // Solo números, máximo 15 caracteres (según BD)
        processedValue = value.replace(/\D/g, "").slice(0, 15)
        break
      case "nombre":
        // Solo letras y espacios, máximo 100 caracteres, convertir a mayúsculas
        processedValue = value
          .replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "")
          .slice(0, 100)
          .toUpperCase()
        break
      case "tel":
        // Solo números, máximo 15 caracteres (según BD)
        processedValue = value.replace(/\D/g, "").slice(0, 15)
        break
      case "email":
        // Convertir a minúsculas, máximo 100 caracteres
        processedValue = value.toLowerCase().slice(0, 100)
        break
      case "direccion":
        // Máximo 255 caracteres, convertir a mayúsculas
        processedValue = value.slice(0, 255).toUpperCase()
        break
      case "password":
        // Máximo 255 caracteres
        processedValue = value.slice(0, 255)
        break
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    })

    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const togglePasswordVisibility = () => {
    setFormData({
      ...formData,
      showPassword: !formData.showPassword,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    // Validación tipo_Doc
    if (!["CC", "CE", "PA"].includes(formData.tipo_Doc)) {
      newErrors.tipo_Doc = "Seleccione un tipo de documento válido"
    }

    // Validación doc (6-15 dígitos según BD)
    if (!formData.doc) {
      newErrors.doc = "El número de documento es obligatorio"
    } else if (formData.doc.length < 6) {
      newErrors.doc = "El documento debe tener al menos 6 dígitos"
    } else if (formData.doc.length > 15) {
      newErrors.doc = "El documento no puede tener más de 15 dígitos"
    }

    // Validación nombre (mínimo 5 caracteres, máximo 100)
    if (!formData.nombre) {
      newErrors.nombre = "El nombre es obligatorio"
    } else if (formData.nombre.trim().length < 5) {
      newErrors.nombre = "El nombre debe tener al menos 5 caracteres"
    }

    // Validación fecha_Nac (mayor de edad)
    if (!formData.fecha_Nac) {
      newErrors.fecha_Nac = "La fecha de nacimiento es obligatoria"
    } else {
      const birthDate = new Date(formData.fecha_Nac)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      if (age < 18) {
        newErrors.fecha_Nac = "El usuario debe ser mayor de 18 años"
      }
    }

    // Validación tel (mínimo 10 dígitos, máximo 15)
    if (!formData.tel) {
      newErrors.tel = "El teléfono es obligatorio"
    } else if (formData.tel.length < 10) {
      newErrors.tel = "El teléfono debe tener al menos 10 dígitos"
    }

    // Validación email (formato correcto, máximo 100 caracteres)
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio"
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(formData.email)) {
      newErrors.email = "Ingrese un correo electrónico válido"
    }

    // Validación direccion (mínimo 10 caracteres, máximo 255)
    if (!formData.direccion) {
      newErrors.direccion = "La dirección es obligatoria"
    } else if (formData.direccion.trim().length < 10) {
      newErrors.direccion = "La dirección debe tener al menos 10 caracteres"
    }

    // Validación password (mínimo 8 caracteres, con complejidad)
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = "La contraseña debe contener mayúscula, minúscula, número y símbolo"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Preparar datos con los nombres correctos para la BD
      const dataToSend = {
        tipo_Doc: formData.tipo_Doc,
        doc: formData.doc,
        nombre: formData.nombre,
        fecha_Nac: formData.fecha_Nac,
        tel: formData.tel,
        email: formData.email,
        direccion: formData.direccion,
        password: formData.password,
      }

      const res = await fetch("/api/usuarios", {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || "Error al registrar el usuarios")
      }

      const result = await res.json()
      alert("Usuario registrado exitosamente")

      // Limpiar formulario después del registro exitoso
      setFormData({
        tipo_Doc: "CC",
        doc: "",
        nombre: "",
        fecha_Nac: "",
        tel: "",
        email: "",
        direccion: "",
        password: "",
        showPassword: false,
      })

      navigate("/InicioAdmin")
    } catch (error) {
      console.error("Error al registrar usuario:", error)
      setErrors({
        ...errors,
        submit: error.message || "Error al registrar el usuario",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="registro-container">
        <h2 className="titulo-formulario">Registro de usuarios</h2>

        <form onSubmit={handleSubmit} className="formulario-registro">
          {errors.submit && <div className="error-message">{errors.submit}</div>}

          <div className="form-row">
            <div className={`form-group ${errors.tipo_Doc ? "has-error" : ""}`}>
              <label>Tipo de Documento *</label>
              <select
                name="tipo_Doc"
                value={formData.tipo_Doc}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="PA">Pasaporte</option>
              </select>
              {errors.tipo_Doc && <span className="error-text">{errors.tipo_Doc}</span>}
            </div>

            <div className={`form-group ${errors.doc ? "has-error" : ""}`}>
              <label>Número de Documento *</label>
              <input
                type="text"
                name="doc"
                value={formData.doc}
                onChange={handleChange}
                className="form-control"
                placeholder="Ej: 1234567890"
                maxLength="15"
                required
              />
              {errors.doc && <span className="error-text">{errors.doc}</span>}
            </div>
          </div>

          <div className={`form-group ${errors.nombre ? "has-error" : ""}`}>
            <label>Nombre Completo *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="form-control"
              placeholder="Ej: JUAN PÉREZ GARCÍA"
              required
              minLength="5"
            />
            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
          </div>

          <div className="form-row">
            <div className={`form-group ${errors.fecha_Nac ? "has-error" : ""}`}>
              <label>Fecha de Nacimiento *</label>
              <div className="input-with-icon">
                <input
                  type="date"
                  name="fecha_Nac"
                  value={formData.fecha_Nac}
                  onChange={handleChange}
                  className="form-control"
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                  required
                />
                <FontAwesomeIcon icon={faCalendarAlt} className="input-icon" />
              </div>
              {errors.fecha_Nac && <span className="error-text">{errors.fecha_Nac}</span>}
            </div>

            <div className={`form-group ${errors.tel ? "has-error" : ""}`}>
              <label>Teléfono *</label>
              <input
                type="tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                className="form-control"
                placeholder="Ej: 3001234567"
                maxLength="15"
                required
              />
              {errors.tel && <span className="error-text">{errors.tel}</span>}
            </div>
          </div>

          <div className={`form-group ${errors.email ? "has-error" : ""}`}>
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

          <div className={`form-group ${errors.direccion ? "has-error" : ""}`}>
            <label>Dirección de residencia *</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="form-control"
              placeholder="Ej: CALLE 100 # 10-20"
              required
              minLength="10"
            />
            {errors.direccion && <span className="error-text">{errors.direccion}</span>}
          </div>

          <div className={`form-group ${errors.password ? "has-error" : ""}`}>
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
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <FontAwesomeIcon icon={faSave} />
              {isSubmitting ? "Registrando..." : "Registrar Usuario"}
            </button>

            <button type="button" className="btn btn-secondary" onClick={() => navigate("/InicioAdmin")}>
              <FontAwesomeIcon icon={faTimes} /> Cancelar
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
