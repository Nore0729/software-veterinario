import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PawPrint, User, AtSign, Lock, ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import '../styles/Mascotas.css';

function RegistroMascota() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [razasDisponibles, setRazasDisponibles] = useState([]);
  const navigate = useNavigate();

  const razasPorEspecie = {
    canino: ["Labrador Retriever", "Pastor Alemán", "Bulldog", "Beagle", "Poodle"],
    felino: ["Siamés", "Persa", "Bengalí", "Maine Coon", "Esfinge"],
    ave: ["Periquito", "Canario", "Cacatúa"],
    roedor: ["Hámster", "Cobaya", "Ratón"],
    reptil: ["Tortuga", "Iguana", "Serpiente"]
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger
  } = useForm({ mode: 'onChange' });

  const requiredFields = {
    1: ['doc_pro', 'nombre', 'especie', 'raza', 'genero'],
    2: ['fecha_nac', 'tamano', 'estado_reproductivo'],
    3: ['vacunado']
  };

  const especieSeleccionada = watch("especie");

  useEffect(() => {
    if (especieSeleccionada && razasPorEspecie[especieSeleccionada.toLowerCase()]) {
      setRazasDisponibles(razasPorEspecie[especieSeleccionada.toLowerCase()]);
    } else {
      setRazasDisponibles([]);
    }
  }, [especieSeleccionada]);

  useEffect(() => {
    const values = watch();
    let filledFields = 0;
    requiredFields[step].forEach(field => {
      const val = values[field];
      if (val && val.toString().trim() !== '') filledFields++;
    });

    const baseProgress = (step - 1) * 33;
    const stepProgress = (filledFields / requiredFields[step].length) * 33;
    setProgress(Math.min(100, Math.round(baseProgress + stepProgress)));
  }, [watch(), step]);

  const nextStep = async () => {
    const valid = await trigger(requiredFields[step]);
    if (valid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data) => {
    data.vacunado = data.vacunado === "Sí";

    try {
      const response = await axios.post('http://localhost:3000/api/registro-mascota', data);
      if (response.status === 201) {
        Swal.fire({
          title: 'Registro exitoso!',
          html: `La mascota <strong>${data.nombre}</strong> fue registrada.`,
          icon: 'success',
          timer: 2500,
          timerProgressBar: true,
          didClose: () => {
            navigate('/mascota/firulais');
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        html: 'No se pudo registrar la mascota. Intenta nuevamente.',
        icon: 'error',
        timer: 3000,
        timerProgressBar: true
      });
    }
  };

  return (
    <div className="registro-container">
      <div className="progress-tracker">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
        <span className="progress-text">{progress}% completado</span>
      </div>

      <header className="registro-header">
        <PawPrint className="icon-paw" />
        <h1>Registro de Mascota</h1>
        <p>
          Paso {step} de 3 - {step === 1 ? 'Información General' : step === 2 ? 'Datos Adicionales' : 'Seguridad'}
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <fieldset className="form-section">
            <legend><User className="icon-legend" /> Información General</legend>

            <div className="input-group">
              <label>Documento del Propietario *</label>
              <input
                type="text"
                {...register("doc_pro", {
                  required: "Campo obligatorio",
                  pattern: { value: /^[0-9]+$/, message: "Solo números permitidos" },
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                  maxLength: { value: 15, message: "Máximo 15 caracteres" }
                })}
                className={errors.doc_pro ? 'error' : ''}
                placeholder="Número de documento"
              />
              {errors.doc_pro && <span className="error-message">{errors.doc_pro.message}</span>}
            </div>

            <div className="input-group">
              <label>Nombre de la Mascota *</label>
              <input
                type="text"
                {...register("nombre", {
                  required: "Campo obligatorio",
                  pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/, message: "Solo letras permitidas" },
                  minLength: { value: 3, message: "Mínimo 3 caracteres" }
                })}
                className={errors.nombre ? 'error' : ''}
                placeholder="Nombre mascota"
              />
              {errors.nombre && <span className="error-message">{errors.nombre.message}</span>}
            </div>

            <div className="input-group">
              <label>Especie *</label>
              <select
                {...register("especie", { required: "Campo obligatorio" })}
                className={errors.especie ? 'error' : ''}
              >
                <option value="">Seleccionar especie</option>
                <option value="canino">Canino</option>
                <option value="felino">Felino</option>
                <option value="ave">Ave</option>
                <option value="roedor">Roedor</option>
                <option value="reptil">Reptil</option>
              </select>
              {errors.especie && <span className="error-message">{errors.especie.message}</span>}
            </div>

            <div className="input-group">
              <label>Raza *</label>
              <select
                {...register("raza", { required: "Campo obligatorio" })}
                className={errors.raza ? 'error' : ''}
              >
                <option value="">Seleccionar raza</option>
                {razasDisponibles.map((raza, i) => (
                  <option key={i} value={raza}>{raza}</option>
                ))}
              </select>
              {errors.raza && <span className="error-message">{errors.raza.message}</span>}
            </div>

            <div className="input-group">
              <label>Género *</label>
              <select
                {...register("genero", { required: "Campo obligatorio" })}
                className={errors.genero ? 'error' : ''}
              >
                <option value="">Seleccionar género</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
              {errors.genero && <span className="error-message">{errors.genero.message}</span>}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="form-section">
            <legend><AtSign className="icon-legend" /> Datos Adicionales</legend>

            <div className="input-group">
              <label>Color</label>
              <input type="text" {...register("color")} placeholder="Color de la mascota" />
            </div>

            <div className="input-group">
              <label>Fecha de Nacimiento *</label>
              <input
                type="date"
                {...register("fecha_nac", { required: "Campo obligatorio" })}
                className={errors.fecha_nac ? 'error' : ''}
              />
              {errors.fecha_nac && <span className="error-message">{errors.fecha_nac.message}</span>}
            </div>

            <div className="input-group">
              <label>Peso (kg)</label>
              <input type="number" step="0.01" {...register("peso")} placeholder="Peso aproximado" />
            </div>

            <div className="input-group">
              <label>Tamaño *</label>
              <select
                {...register("tamano", { required: "Campo obligatorio" })}
                className={errors.tamano ? 'error' : ''}
              >
                <option value="">Seleccionar tamaño</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </select>
              {errors.tamano && <span className="error-message">{errors.tamano.message}</span>}
            </div>

            <div className="input-group">
              <label>Estado Reproductivo *</label>
              <select
                {...register("estado_reproductivo", { required: "Campo obligatorio" })}
                className={errors.estado_reproductivo ? 'error' : ''}
              >
                <option value="">Seleccionar estado</option>
                <option value="Intacto">Intacto</option>
                <option value="Esterilizado">Esterilizado</option>
                <option value="Castrado">Castrado</option>
              </select>
              {errors.estado_reproductivo && <span className="error-message">{errors.estado_reproductivo.message}</span>}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="form-section">
            <legend><Lock className="icon-legend" /> Seguridad y Observaciones</legend>

            <div className="input-group">
              <label>Vacunado *</label>
              <select
                {...register("vacunado", { required: "Campo obligatorio" })}
                className={errors.vacunado ? 'error' : ''}
              >
                <option value="">Seleccionar opción</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
              {errors.vacunado && <span className="error-message">{errors.vacunado.message}</span>}
            </div>

            <div className="input-group">
              <label>Observaciones</label>
              <textarea {...register("observaciones")} placeholder="Comentarios adicionales" rows="3"></textarea>
            </div>
          </fieldset>
        )}

        <div className="form-navigation">
          {step > 1 && (
            <button type="button" className="nav-btn prev-btn" onClick={prevStep}>
              <ChevronLeft /> Anterior
            </button>
          )}
          {step < 3 && (
            <button type="button" className="nav-btn prev-btn" onClick={nextStep}>
              Siguiente <ChevronRight />
            </button>
          )}
          {step === 3 && (
            <button type="submit" className="btn-submit">Registrar</button>
          )}
        </div>
      </form>
    </div>
  );
}

export default RegistroMascota;