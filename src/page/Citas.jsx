import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Citas.css'

function Citas() {
  // Este componente ahora solo se encarga de CREAR citas nuevas
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    mode: 'onChange',
  });
  const navigate = useNavigate();

  // Estados para datos dinámicos de los menús desplegables
  const [propietarios, setPropietarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loadingMascotas, setLoadingMascotas] = useState(false);

  // Observamos el valor del propietario seleccionado para cargar sus mascotas
  const selectedPropietarioDoc = watch("propietario_doc");

  // useEffect para cargar datos iniciales (propietarios, servicios, etc.)
  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const [propietariosRes, serviciosRes, veterinariosRes] = await Promise.all([
                fetch('/api/propietarios'),
                fetch('/api/servicios'),
                fetch('/api/veterinarios')
            ]);
            setPropietarios(await propietariosRes.json());
            setServicios(await serviciosRes.json());
            setVeterinarios(await veterinariosRes.json());
        } catch (error) {
            console.error("Error cargando datos iniciales para el formulario:", error);
        }
    };
    fetchInitialData();
  }, []);

  // useEffect para cargar las mascotas cuando cambia el propietario
  useEffect(() => {
    const fetchMascotas = async () => {
        if (selectedPropietarioDoc) {
            setLoadingMascotas(true);
            setMascotas([]); // Limpiamos la lista anterior
            try {
                const response = await fetch(`/api/propietarios/${selectedPropietarioDoc}/mascotas`);
                setMascotas(await response.json());
            } catch (error) {
                console.error("Error cargando las mascotas:", error);
            } finally {
                setLoadingMascotas(false);
            }
        } else {
            setMascotas([]);
        }
    };
    fetchMascotas();
  }, [selectedPropietarioDoc]);


  // Función para enviar el formulario y crear una nueva cita
  const onSubmit = async (data) => {
    try {
        const response = await fetch('/api/citasvet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'No se pudo agendar la cita.');
        }

        await Swal.fire({
            title: '¡Cita Agendada!',
            text: 'La nueva cita ha sido registrada correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
        });

        // Redirigimos a la lista de citas para ver el cambio
        navigate('/CitasVet'); 

    } catch (error) {
        console.error("Error al enviar el formulario:", error);
        Swal.fire({
            title: 'Error',
            text: `No se pudo agendar la cita: ${error.message}`,
            icon: 'error',
        });
    }
  };

  return (
    <div className="cita-contenedor">
      <div className="cita-formulario-contenedor">
        <form className="cita-formulario" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="cita-titulo">Agendar Nueva Cita</h1>
          <div className="cita-secciones">
            
            <div className="cita-seccion">
              <h2 className="cita-subtitulo">Datos del Paciente</h2>
              <label className="cita-label">Propietario *</label>
              <select
                className={`cita-input ${errors.propietario_doc ? 'input-error' : ''}`}
                {...register('propietario_doc', { required: "Selecciona un propietario" })}
              >
                <option value="">-- Seleccionar Propietario --</option>
                {propietarios.map(p => (
                    <option key={p.id} value={p.doc}>{p.nombre} ({p.doc})</option>
                ))}
              </select>
              {errors.propietario_doc && <p className="error-text">{errors.propietario_doc.message}</p>}

              <label className="cita-label">Mascota *</label>
              <select
                className={`cita-input ${errors.mascota_id ? 'input-error' : ''}`}
                {...register('mascota_id', { required: "Selecciona una mascota" })}
                disabled={!selectedPropietarioDoc || loadingMascotas}
              >
                <option value="">{loadingMascotas ? 'Cargando...' : '-- Seleccionar Mascota --'}</option>
                {mascotas.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre} ({m.especie})</option>
                ))}
              </select>
              {errors.mascota_id && <p className="error-text">{errors.mascota_id.message}</p>}
            </div>

            <div className="cita-seccion">
              <h2 className="cita-subtitulo">Detalles de la Cita</h2>
              <label className="cita-label">Servicio *</label>
                <select
                className={`cita-input ${errors.servicio_id ? 'input-error' : ''}`}
                {...register('servicio_id', { required: "Selecciona un servicio" })}
              >
                <option value="">-- Seleccionar Servicio --</option>
                {servicios.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
              {errors.servicio_id && <p className="error-text">{errors.servicio_id.message}</p>}

              <label className="cita-label">Veterinario *</label>
                <select
                className={`cita-input ${errors.vet_id ? 'input-error' : ''}`}
                {...register('vet_id', { required: "Selecciona un veterinario" })}
              >
                <option value="">-- Seleccionar Veterinario --</option>
                {veterinarios.map(v => (
                    <option key={v.vet_id} value={v.vet_id}>Dr. {v.nombre}</option>
                ))}
              </select>
              {errors.vet_id && <p className="error-text">{errors.vet_id.message}</p>}
            </div>
            
            <div className="cita-seccion">
              <div className="cita-seleccion-fecha">
                <label className="cita-label">Fecha *</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className={`cita-input ${errors.fecha_hora ? 'input-error' : ''}`}
                  {...register('fecha_hora', { required: "La fecha es obligatoria" })}
                />
                {errors.fecha_hora && <p className="error-text">{errors.fecha_hora.message}</p>}
              </div>
              <div className="cita-seleccion-hora">
                <label className="cita-label">Hora *</label>
                <select
                  className={`cita-input ${errors.time ? 'input-error' : ''}`}
                  {...register('time', { required: "Selecciona una hora" })}
                >
                  <option value="">-- Seleccionar Hora --</option>
                  {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(time => (
                      <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.time && <p className="error-text">{errors.time.message}</p>}
              </div>
            </div>

            <div className="cita-seccion">
              <label className="cita-label">Motivo o Notas Adicionales</label>
              <textarea
                placeholder="Motivo de la cita, síntomas, etc."
                rows="3"
                className="cita-textarea"
                {...register('motivo', { maxLength: { value: 500, message: "Máximo 500 caracteres" } })}
              ></textarea>
              {errors.motivo && <p className="error-text">{errors.motivo.message}</p>}
            </div>
          </div>

          <button type="submit" className="cita-boton-enviar">
            Agendar Cita
          </button>
        </form>
      </div>
    </div>
  );
}

export default Citas;