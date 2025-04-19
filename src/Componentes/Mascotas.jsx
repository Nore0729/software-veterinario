import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import '../Estilos_F/Mascotas.css';

function Mascota() {
  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm({
    mode: 'onChange'
  });

  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const formData = watch();
  const especieSeleccionada = watch("especie");

  const razasPorEspecie = {
    canino: ["Labrador Retriever", "Pastor Alemán", "Bulldog", "Beagle", "Poodle"],
    felino: ["Siamés", "Persa", "Bengalí", "Maine Coon", "Esfinge"],
    ave: ["Periquito", "Canario", "Cacatúa"],
    roedor: ["Hámster", "Cobaya", "Ratón"],
    reptil: ["Tortuga", "Iguana", "Serpiente"]
  };


  useEffect(() => {
    const requiredFields = {
      1: ['nombre', 'especie', 'raza', 'foto'],
      2: ['genero', 'fechaNacimiento', 'peso', 'color'],
      3: ['tamano', 'estadoReproductivo']
    };

    let filledFields = 0;
    let totalRequired = 0;

    // Progreso por pasos completados (33% por paso)
    const stepWeight = 33.33;
    const baseProgress = (step - 1) * stepWeight;

    // Progreso dentro del paso actual
    requiredFields[step].forEach(field => {
      totalRequired++;
      if (formData[field] && formData[field] !== '') filledFields++;
    });

    const currentStepProgress = totalRequired > 0 ? (filledFields / totalRequired) * stepWeight : 0;
    const newProgress = Math.min(100, Math.round(baseProgress + currentStepProgress));
    
    setProgress(newProgress);
  }, [formData, step]);

  const onSubmit = (data) => {
    console.log('Mascota registrada:', data);
    
  };

  const nextStep = async () => {
    const fields = {
      1: ['nombre', 'especie', 'raza'],
      2: ['genero', 'fechaNacimiento', 'peso'],
      3: []
    };

    const isValid = await trigger(fields[step]);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="mascota-container">
      <header className="mascota-header">
        <h1>🐾 Registrar Nueva Mascota</h1>
        
     
        <div className="progress-tracker">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
            aria-label={`Progreso: ${progress}%`}
          >
            <span className="progress-text">{progress}%</span>
          </div>
        </div>

        
        <div className="step-indicator">
          <span className={step >= 1 ? 'active' : ''}>1. Identificación</span>
          <span className={step >= 2 ? 'active' : ''}>2. Características</span>
          <span className={step >= 3 ? 'active' : ''}>3. Salud</span>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="mascota-form">
        
        {step === 1 && (
          <fieldset className="form-section">
            <legend>Información Básica</legend>
            
            <div className="photo-upload">
              <label>Foto de perfil *</label>
              <div className="upload-container">
                <input
                  type="file"
                  id="pet-photo"
                  accept="image/*"
                  {...register("foto", { required: "Requerido" })}
                />
                <label htmlFor="pet-photo" className="upload-btn">
                  <span>+</span> Subir imagen
                </label>
                {errors.foto && <span className="error-message">{errors.foto.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                {...register("nombre", { required: "Requerido" })}
                className={errors.nombre && 'error'}
              />
              {errors.nombre && <span className="error-message">{errors.nombre.message}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Especie *</label>
                <select
                  {...register("especie", { required: "Requerido" })}
                  className={errors.especie && 'error'}
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
                  {...register("raza", { required: "Requerido" })}
                  className={errors.raza && 'error'}
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

        {/* PASO 2 */}
        {step === 2 && (
          <fieldset className="form-section">
            <legend>Características Físicas</legend>
            
            <div className="form-row">
              <div className="form-group">
                <label>Género *</label>
                <select
                  {...register("genero", { required: "Requerido" })}
                  className={errors.genero && 'error'}
                >
                  <option value="">Seleccionar...</option>
                  <option value="macho">Macho</option>
                  <option value="hembra">Hembra</option>
                </select>
                {errors.genero && <span className="error-message">{errors.genero.message}</span>}
              </div>

              <div className="form-group">
                <label>Color *</label>
                <input
                  type="text"
                  {...register("color", { required: "Requerido" })}
                  className={errors.color && 'error'}
                />
                {errors.color && <span className="error-message">{errors.color.message}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha Nacimiento *</label>
                <input
                  type="date"
                  {...register("fechaNacimiento", { required: "Requerido" })}
                  className={errors.fechaNacimiento && 'error'}
                />
                {errors.fechaNacimiento && <span className="error-message">{errors.fechaNacimiento.message}</span>}
              </div>

              <div className="form-group">
                <label>Peso (kg) *</label>
                <div className="weight-input">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    {...register("peso", { 
                      required: "Requerido",
                      min: { value: 0.1, message: "Mínimo 0.1kg" }
                    })}
                    className={errors.peso && 'error'}
                  />
                  <span>kg</span>
                </div>
                {errors.peso && <span className="error-message">{errors.peso.message}</span>}
              </div>
            </div>
          </fieldset>
        )}

        {/* PASO 3 */}
        {step === 3 && (
          <fieldset className="form-section">
            <legend>Información de Salud</legend>
            
            <div className="form-row">
              <div className="form-group">
                <label>Tamaño *</label>
                <select
                  {...register("tamano", { required: "Requerido" })}
                  className={errors.tamano && 'error'}
                >
                  <option value="">Seleccionar...</option>
                  <option value="pequeno">Pequeño</option>
                  <option value="mediano">Mediano</option>
                  <option value="grande">Grande</option>
                </select>
                {errors.tamano && <span className="error-message">{errors.tamano.message}</span>}
              </div>

              <div className="form-group">
                <label>Estado Reproductivo *</label>
                <select
                  {...register("estadoReproductivo", { required: "Requerido" })}
                  className={errors.estadoReproductivo && 'error'}
                >
                  <option value="">Seleccionar...</option>
                  <option value="intacto">Intacto</option>
                  <option value="esterilizado">Esterilizado</option>
                </select>
                {errors.estadoReproductivo && <span className="error-message">{errors.estadoReproductivo.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Observaciones</label>
              <textarea
                rows="3"
                {...register("observaciones")}
                placeholder="Alergias, medicamentos, etc."
              ></textarea>
            </div>

            <div className="form-checkbox">
              <input 
                type="checkbox" 
                id="vacunado" 
                {...register("vacunado")} 
              />
              <label htmlFor="vacunado">Vacunación al día</label>
            </div>
          </fieldset>
        )}

        <div className="form-actions">
          {step > 1 && (
            <button 
              type="button" 
              onClick={prevStep} 
              className="cancel-btn"
            >
              ← Anterior
            </button>
          )}
          
          {step < 3 ? (
            <button 
              type="button" 
              onClick={nextStep} 
              className="submit-btn"
            >
              Siguiente →
            </button>
          ) : (
            <button 
              type="submit" 
              className="submit-btn"
            >
              🐶 Registrar Mascota
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Mascota;