import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PawPrint, User, AtSign, Lock, ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios'; // Importamos Axios
import '../Estilos_F/Propietarios.css';

function RegistroPropietario() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  
  const {
    register, 
    handleSubmit, 
    formState: { errors },
    watch,
    trigger
  } = useForm({ mode: 'onChange' });

  const password = watch("password");
  const formValues = watch();

  // Campos requeridos por paso
  const requiredFields = {
    1: ['tipoDocumento', 'documento', 'nombre', 'fechaNacimiento'],
    2: ['telefono', 'email', 'direccion'],
    3: ['password', 'confirmPassword', 'terms']
  };

  // Calcula progreso automáticamente
  useEffect(() => {
    let filledFields = 0;
    requiredFields[step].forEach(field => {
      const value = formValues[field];
      if (value && value.toString().trim() !== '') {
        filledFields++;
      }
    });

    const baseProgress = (step - 1) * 33;
    const stepProgress = step === 1 && filledFields === 0 
      ? 0 
      : (filledFields / requiredFields[step].length) * 33;
    
    setProgress(Math.min(100, Math.round(baseProgress + stepProgress)));
  }, [formValues, step]);

  const validarEdad = (fecha) => {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad >= 18;
  };

  const nextStep = async () => {
    const isValid = await trigger(requiredFields[step]);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data) => {
    try {
      // Hacemos una solicitud POST al backend con los datos del formulario
      const response = await axios.post('http://localhost:3000/api/registro-propietario', data);
      
      // Si la respuesta es exitosa, mostramos un mensaje de éxito
      Swal.fire({
        title: '<strong>Registro exitoso!</strong>',
        html: `<i>El propietario <strong>${data.nombre}</strong> fue registrado</i>`,
        icon: 'success',
        timer: 3000
      });
    } catch (error) {
      // Si ocurre un error, mostramos un mensaje de error
      Swal.fire({
        title: '<strong>Error!</strong>',
        html: `<i>No se pudo registrar al propietario. Intenta nuevamente.</i>`,
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
        <h1>Registro de Propietario</h1>
        <p>Paso {step} de 3 - {step === 1 ? 'Información Personal' : step === 2 ? 'Contacto' : 'Seguridad'}</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* PASO 1: Información Personal */}
        {step === 1 && (
          <fieldset className="form-section">
            <legend><User className="icon-legend" /> Información Personal</legend>
            
            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Tipo de Documento *</label>
              </div>
              <select
                {...register("tipoDocumento", { required: "Campo obligatorio" })}
                className={errors.tipoDocumento ? 'error' : ''}
              >
                <option value="">Seleccionar</option>
                <option value="CC">Cédula</option>
                <option value="TI">Tarjeta Identidad</option>
                <option value="CE">Cédula Extranjería</option>
              </select>
              {errors.tipoDocumento && (
                <span className="error-message">{errors.tipoDocumento.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Número de Documento *</label>
              </div>
              <input
                type="text"
                {...register("documento", {
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
                    value: 12,
                    message: "Máximo 12 caracteres"
                  }
                })}
                className={errors.documento ? 'error' : ''}
                placeholder="Escribe tu número de documento"
              />
              {errors.documento && (
                <span className="error-message">{errors.documento.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Nombre Completo *</label>
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
                placeholder="Escribe tu nombre"
              />
              {errors.nombre && (
                <span className="error-message">{errors.nombre.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Fecha de Nacimiento *</label>
              </div>
              <input
                type="date"
                {...register("fechaNacimiento", {
                  required: "Campo obligatorio",
                  validate: value => validarEdad(value) || "Debes ser mayor de 18 años"
                })}
                className={errors.fechaNacimiento ? 'error' : ''}
              />
              {errors.fechaNacimiento && (
                <span className="error-message">{errors.fechaNacimiento.message}</span>
              )}
            </div>
          </fieldset>
        )}

        {/* PASO 2: Contacto */}
        {step === 2 && (
          <fieldset className="form-section">
            <legend><AtSign className="icon-legend" /> Información de Contacto</legend>
            
            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Teléfono *</label>
              </div>
              <input
                type="tel"
                {...register("telefono", {
                  required: "Campo obligatorio",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Solo números permitidos"
                  },
                  minLength: {
                    value: 10,
                    message: "Mínimo 10 dígitos"
                  }
                })}
                className={errors.telefono ? 'error' : ''}
                placeholder="Escribe tu teléfono"
              />
              {errors.telefono && (
                <span className="error-message">{errors.telefono.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="label-container">
                <AtSign className="icon-small" />
                <label>Correo Electrónico *</label>
              </div>
              <input
                type="email"
                {...register("email", {
                  required: "Campo obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo no válido"
                  }
                })}
                className={errors.email ? 'error' : ''}
                placeholder="tu@correo.com"
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="label-container">
                <User className="icon-small" />
                <label>Dirección *</label>
              </div>
              <input
                type="text"
                {...register("direccion", {
                  required: "Campo obligatorio",
                  minLength: {
                    value: 10,
                    message: "Mínimo 10 caracteres"
                  }
                })}
                className={errors.direccion ? 'error' : ''}
                placeholder="Escribe tu dirección"
              />
              {errors.direccion && (
                <span className="error-message">{errors.direccion.message}</span>
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
                <label>Contraseña *</label>
              </div>
              <input
                type="password"
                {...register("password", {
                  required: "Campo obligatorio",
                  minLength: {
                    value: 8,
                    message: "Mínimo 8 caracteres"
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Debe incluir mayúscula, minúscula, número y símbolo"
                  }
                })}
                className={errors.password ? 'error' : ''}
                placeholder="Crea una contraseña segura"
              />
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="label-container">
                <Lock className="icon-small" />
                <label>Confirmar Contraseña *</label>
              </div>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Campo obligatorio",
                  validate: value => value === password || "Las contraseñas no coinciden"
                })}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Repite tu contraseña"
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword.message}</span>
              )}
            </div>

            <div className="terms-group">
              <input
                type="checkbox"
                id="terms"
                {...register("terms", {
                  required: "Debes aceptar los términos y condiciones"
                })}
              />
              <label htmlFor="terms">
                Acepto los <Link to="/terminos">Términos y Condiciones</Link> y el{' '}
                <Link to="/privacidad">Aviso de Privacidad</Link>
              </label>
              {errors.terms && (
                <span className="error-message">{errors.terms.message}</span>
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
              Registrar Propietario
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

export default RegistroPropietario;