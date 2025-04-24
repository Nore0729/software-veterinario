import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PawPrint, User, AtSign, Lock, ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios'; 
import '../Estilos_F/Mascotas.css';

function RegistroMascota() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate(); 

  const {
    register, 
    handleSubmit, 
    formState: { errors },
    watch,
    trigger
  } = useForm({ mode: 'onChange' });

  const requiredFields = {
    1: ['documentoPropietario', 'nombre', 'especie', 'raza', 'genero'],
    2: ['color', 'fechaNacimiento', 'peso', 'tamano', 'estadoReproductivo'],
    3: ['vacunado', 'observaciones']
  };

  // Calcula progreso automáticamente
  useEffect(() => {
    let filledFields = 0;
    requiredFields[step].forEach(field => {
      const value = watch(field);
      if (value && value.toString().trim() !== '') {
        filledFields++;
      }
    });

    const baseProgress = (step - 1) * 33;
    const stepProgress = (filledFields / requiredFields[step].length) * 33;
    
    setProgress(Math.min(100, Math.round(baseProgress + stepProgress)));
  }, [watch(), step]);

  const nextStep = async () => {
    const isValid = await trigger(requiredFields[step]);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/api/registro-mascota', data);
      
      Swal.fire({
        title: '<strong>Registro exitoso!</strong>',
        html: `<i>La mascota <strong>${data.nombre}</strong> fue registrada</i>`,
        icon: 'success',
        timer: 3000,
        didClose: () => {
          navigate('/MascotasBienvenida');
        }
      });

    } catch (error) {
      Swal.fire({
        title: '<strong>Error!</strong>',
        html: `<i>No se pudo registrar la mascota. Intenta nuevamente.</i>`,
        icon: 'error',
        timer: 3000
      });
    }
  };

  return (
    <div className="registro-container">
      {/* Barra de progreso */}
      <div className="progress-tracker">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
        <span className="progress-text">{progress}% completado</span>
      </div>

      <header className="registro-header">
        <PawPrint className="icon-paw" />
        <h1>Registro de Mascota</h1>
        <p>Paso {step} de 3 - {step === 1 ? 'Información General' : step === 2 ? 'Datos Adicionales' : 'Seguridad'}</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* PASO 1: Información General */}
        {step === 1 && (
          <fieldset className="form-section">
            <legend><User className="icon-legend" /> Información General</legend>
            
            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Documento del Propietario *</label>
              </div>
              <input
                type="text"
                {...register("documentoPropietario", {
                  required: "Campo obligatorio",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Solo números permitidos"
                  },
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres"
                  },
                  maxLength: {
                    value: 15,
                    message: "Máximo 15 caracteres"
                  }
                })}
                className={errors.documentoPropietario ? 'error' : ''}
                placeholder="Número de documento del propietario"
              />
              {errors.documentoPropietario && (
                <span className="error-message">{errors.documentoPropietario.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Nombre de la Mascota *</label>
              </div>
              <input
                type="text"
                {...register("nombre", {
                  required: "Campo obligatorio",
                  pattern: {
                    value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/,
                    message: "Solo letras permitidas"
                  },
                  minLength: {
                    value: 3,
                    message: "Mínimo 3 caracteres"
                  }
                })}
                className={errors.nombre ? 'error' : ''}
                placeholder="Escribe el nombre de la mascota"
              />
              {errors.nombre && (
                <span className="error-message">{errors.nombre.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Especie *</label>
              </div>
              <input
                type="text"
                {...register("especie", {
                  required: "Campo obligatorio",
                })}
                className={errors.especie ? 'error' : ''}
                placeholder="Escribe la especie de la mascota"
              />
              {errors.especie && (
                <span className="error-message">{errors.especie.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Raza *</label>
              </div>
              <input
                type="text"
                {...register("raza", {
                  required: "Campo obligatorio",
                })}
                className={errors.raza ? 'error' : ''}
                placeholder="Escribe la raza de la mascota"
              />
              {errors.raza && (
                <span className="error-message">{errors.raza.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Género *</label>
              </div>
              <select
                {...register("genero", { required: "Campo obligatorio" })}
                className={errors.genero ? 'error' : ''}
              >
                <option value="">Seleccionar</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
              {errors.genero && (
                <span className="error-message">{errors.genero.message}</span>
              )}
            </div>
          </fieldset>
        )}

        {/* PASO 2: Datos Adicionales */}
        {step === 2 && (
          <fieldset className="form-section">
            <legend><AtSign className="icon-legend" /> Datos Adicionales</legend>

            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Color</label>
              </div>
              <input
                type="text"
                {...register("color")}
                className={errors.color ? 'error' : ''}
                placeholder="Escribe el color de la mascota"
              />
              {errors.color && (
                <span className="error-message">{errors.color.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Fecha de Nacimiento</label>
              </div>
              <input
                type="date"
                {...register("fechaNacimiento")}
                className={errors.fechaNacimiento ? 'error' : ''}
              />
              {errors.fechaNacimiento && (
                <span className="error-message">{errors.fechaNacimiento.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Peso (kg)</label>
              </div>
              <input
                type="number"
                {...register("peso")}
                className={errors.peso ? 'error' : ''}
                placeholder="Escribe el peso de la mascota"
              />
              {errors.peso && (
                <span className="error-message">{errors.peso.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Tamaño</label>
              </div>
              <input
                type="text"
                {...register("tamano")}
                className={errors.tamano ? 'error' : ''}
                placeholder="Escribe el tamaño de la mascota"
              />
              {errors.tamano && (
                <span className="error-message">{errors.tamano.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Estado Reproductivo</label>
              </div>
              <select
                {...register("estadoReproductivo")}
                className={errors.estadoReproductivo ? 'error' : ''}
              >
                <option value="">Seleccionar</option>
                <option value="Castrado">Castrado</option>
                <option value="No Castrado">No Castrado</option>
              </select>
              {errors.estadoReproductivo && (
                <span className="error-message">{errors.estadoReproductivo.message}</span>
              )}
            </div>
          </fieldset>
        )}

        {/* PASO 3: Seguridad */}
        {step === 3 && (
          <fieldset className="form-section">
            <legend><Lock className="icon-legend" /> Seguridad</legend>
            
            <div className="input-group">
              <div className="label-container">
                <Lock className="icon-small" />
                <label>Vacunado</label>
              </div>
              <select
                {...register("vacunado")}
                className={errors.vacunado ? 'error' : ''}
              >
                <option value="">Seleccionar</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
              {errors.vacunado && (
                <span className="error-message">{errors.vacunado.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="label-container">
                <Lock className="icon-small" />
                <label>Observaciones</label>
              </div>
              <textarea
                {...register("observaciones")}
                className={errors.observaciones ? 'error' : ''}
                placeholder="Escribe las observaciones de la mascota"
              />
              {errors.observaciones && (
                <span className="error-message">{errors.observaciones.message}</span>
              )}
            </div>
          </fieldset>
        )}

        {/* Navegación entre pasos */}
        <div className="form-navigation">
          {step > 1 && (
            <button 
              type="button" 
              onClick={prevStep} 
              className="nav-btn prev-btn"
            >
              <ChevronLeft size={18} /> Anterior
            </button>
          )}
          
          {step < 3 ? (
            <button 
              type="button" 
              onClick={nextStep} 
              className="nav-btn next-btn"
            >
              Siguiente <ChevronRight size={18} />
            </button>
          ) : (
            <button type="submit" className="submit-btn">
              Registrar Mascota
            </button>
          )}
        </div>

        <div className="login-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </form>
    </div>
  );
}

export default RegistroMascota;


