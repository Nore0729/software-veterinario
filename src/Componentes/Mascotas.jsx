import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../Estilos_F/Mascotas.css';

function Mascota() {
  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm({
    mode: 'onChange'
  });

  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [fotoFile, setFotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const formValues = watch();
  const especieSeleccionada = watch("especie");

  // Razas por especie
  const razasPorEspecie = {
    canino: ["Labrador Retriever", "Pastor Alemán", "Bulldog", "Beagle", "Poodle"],
    felino: ["Siamés", "Persa", "Bengalí", "Maine Coon", "Esfinge"],
    ave: ["Periquito", "Canario", "Cacatúa"],
    roedor: ["Hámster", "Cobaya", "Ratón"],
    reptil: ["Tortuga", "Iguana", "Serpiente"]
  };

  // Obtener token JWT del localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const token = getToken();
    if (!token) {
      Swal.fire({
        title: 'Acceso no autorizado',
        text: 'Debes iniciar sesión para registrar mascotas',
        icon: 'error'
      }).then(() => {
        navigate('/login');
      });
    }
  }, [navigate]);

  // Calcular progreso
  useEffect(() => {
    const requiredFields = {
      1: ['nombre', 'especie', 'raza'],
      2: ['genero', 'fechaNacimiento', 'peso', 'color'],
      3: ['tamano', 'estadoReproductivo']
    };

    let filledFields = 0;
    requiredFields[step].forEach(field => {
      if (formValues[field]) filledFields++;
    });

    const baseProgress = (step - 1) * 33;
    const stepProgress = (filledFields / requiredFields[step].length) * 33;
    setProgress(Math.min(100, baseProgress + stepProgress));
  }, [formValues, step]);

  // Manejar subida de foto
  const handleFileChange = (e) => {
    setFotoFile(e.target.files[0]);
  };

  // Navegación entre pasos
  const nextStep = async () => {
    const fields = {
      1: ['nombre', 'especie', 'raza'],
      2: ['genero', 'fechaNacimiento', 'peso', 'color'],
      3: []
    };

    const isValid = await trigger(fields[step]);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  // Enviar datos al backend
  const onSubmit = async (data) => {
    const token = getToken();
    if (!token) {
      Swal.fire('Error', 'Sesión expirada. Vuelve a iniciar sesión', 'error');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key !== 'foto' && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });
      
      if (fotoFile) formData.append('foto', fotoFile);

      const response = await axios.post(
        'http://localhost:3000/api/registro-mascota',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      Swal.fire({
        title: '¡Éxito!',
        text: 'Mascota registrada correctamente',
        icon: 'success',
        timer: 2000
      }).then(() => {
        navigate('/mis-mascotas'); // Redirige después del registro
      });
    } catch (error) {
      let errorMessage = 'Error al registrar la mascota';
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mascota-container">
      <header className="mascota-header">
        <h1>🐾 Registrar Nueva Mascota</h1>
        
        {/* Barra de progreso */}
        <div className="progress-tracker">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
          <span className="progress-text">{progress}% completado</span>
        </div>

        {/* Indicador de pasos */}
        <div className="step-indicator">
          <span className={step >= 1 ? 'active' : ''}>1. Identificación</span>
          <span className={step >= 2 ? 'active' : ''}>2. Características</span>
          <span className={step >= 3 ? 'active' : ''}>3. Salud</span>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="mascota-form">
        {/* PASO 1: Información básica */}
        {step === 1 && (
          <fieldset className="form-section">
            <legend>Información Básica</legend>
            
            <div className="photo-upload">
              <label>Foto de perfil</label>
              <div className="upload-container">
                <input
                  type="file"
                  id="pet-photo"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label htmlFor="pet-photo" className="upload-btn">
                  {fotoFile ? '✔ Cambiar imagen' : '+ Subir imagen'}
                </label>
                {fotoFile && <span className="file-name">{fotoFile.name}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                {...register("nombre", { 
                  required: "Campo obligatorio",
                  minLength: {
                    value: 2,
                    message: "Mínimo 2 caracteres"
                  }
                })}
                className={errors.nombre ? 'error' : ''}
              />
              {errors.nombre && <span className="error-message">{errors.nombre.message}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Especie *</label>
                <select
                  {...register("especie", { required: "Campo obligatorio" })}
                  className={errors.especie ? 'error' : ''}
                >
                  <option value="">Seleccionar...</option>
                  {Object.keys(razasPorEspecie).map(especie => (
                    <option key={especie} value={especie}>
                      {especie.charAt(0).toUpperCase() + especie.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.especie && <span className="error-message">{errors.especie.message}</span>}
              </div>

              <div className="form-group">
                <label>Raza *</label>
                <select
                  {...register("raza", { required: "Campo obligatorio" })}
                  className={errors.raza ? 'error' : ''}
                  disabled={!especieSeleccionada}
                >
                  <option value="">Seleccionar...</option>
                  {especieSeleccionada && razasPorEspecie[especieSeleccionada].map(raza => (
                    <option key={raza} value={raza}>{raza}</option>
                  ))}
                </select>
                {errors.raza && <span className="error-message">{errors.raza.message}</span>}
              </div>
            </div>
          </fieldset>
        )}

        {/* Resto del formulario (pasos 2 y 3) se mantiene igual */}
        {/* ... */}

        {/* Botones de navegación */}
        <div className="form-actions">
          {step > 1 && (
            <button 
              type="button" 
              onClick={prevStep} 
              className="cancel-btn"
              disabled={isSubmitting}
            >
              ← Anterior
            </button>
          )}
          
          {step < 3 ? (
            <button 
              type="button" 
              onClick={nextStep} 
              className="submit-btn"
              disabled={isSubmitting}
            >
              Siguiente →
            </button>
          ) : (
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : '🐶 Registrar Mascota'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Mascota;