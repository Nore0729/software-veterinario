import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Citas.css'

function Citas() {
    // Usamos react-hook-form para manejar el formulario
    const { register, handleSubmit, control, formState: { errors }, watch } = useForm({
        mode: 'onChange',
    });
    const navigate = useNavigate();

    // --- ESTADOS PARA DATOS DINÁMICOS ---
    const [propietarios, setPropietarios] = useState([]);
    const [mascotas, setMascotas] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [veterinarios, setVeterinarios] = useState([]);
    const [loadingMascotas, setLoadingMascotas] = useState(false);

    // Observamos el valor del propietario seleccionado para cargar sus mascotas
    const selectedPropietarioDoc = watch("propietario_doc");

    // --- useEffect PARA CARGAR DATOS INICIALES ---
    useEffect(() => {
        // Cargamos propietarios, servicios y veterinarios al iniciar
        const fetchInitialData = async () => {
            try {
                const [propietariosRes, serviciosRes, veterinariosRes] = await Promise.all([
                    fetch('/api/propietarios'),
                    fetch('/api/servicios'),
                    fetch('/api/veterinarios')
                ]);
                const propietariosData = await propietariosRes.json();
                const serviciosData = await serviciosRes.json();
                const veterinariosData = await veterinariosRes.json();
                
                setPropietarios(propietariosData);
                setServicios(serviciosData);
                setVeterinarios(veterinariosData);
            } catch (error) {
                console.error("Error cargando datos iniciales para el formulario:", error);
            }
        };
        fetchInitialData();
    }, []);

    // --- useEffect PARA CARGAR MASCOTAS CUANDO CAMBIA EL PROPIETARIO ---
    useEffect(() => {
        const fetchMascotas = async () => {
            if (selectedPropietarioDoc) {
                setLoadingMascotas(true);
                setMascotas([]); // Limpiamos la lista anterior
                try {
                    const response = await fetch(`/api/propietarios/${selectedPropietarioDoc}/mascotas`);
                    const data = await response.json();
                    setMascotas(data);
                } catch (error) {
                    console.error("Error cargando las mascotas:", error);
                } finally {
                    setLoadingMascotas(false);
                }
            } else {
                setMascotas([]); // Si no hay propietario, la lista de mascotas está vacía
            }
        };
        fetchMascotas();
    }, [selectedPropietarioDoc]);


    // --- FUNCIÓN PARA ENVIAR EL FORMULARIO ---
    // (Esta es la que conectaremos en el siguiente paso)
   const onSubmit = async (data) => {
    // Combinamos la fecha y la hora en un solo campo para el backend
    const datosParaEnviar = {
      ...data,
      fecha_hora: data.fecha_hora, // react-hook-form ya nos da el YYYY-MM-DD
      time: data.time            // y la hora HH:MM
    };

    console.log("Enviando estos datos al backend:", datosParaEnviar);

    try {
        const response = await fetch('/api/citasvet', { // Apunta a la ruta que creamos
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosParaEnviar),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'No se pudo agendar la cita.');
        }

        // Si todo sale bien, mostramos una alerta de éxito
        await Swal.fire({
            title: '¡Cita Agendada!',
            text: 'La nueva cita ha sido registrada correctamente.',
            icon: 'success',
            confirmButtonColor: '#00A79D',
        });

        // Y redirigimos al usuario a la lista de citas para que vea el cambio
        // Asegúrate de que esta sea la ruta correcta a tu componente CitasVet.jsx
        navigate('/citas-vet'); 

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
                {/* Usamos el handleSubmit de react-hook-form en el <form> */}
                <form className="cita-formulario" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="cita-titulo">Agendar Nueva Cita</h1>
                    <div className="cita-secciones">
                        
                        {/* --- SECCIÓN DE PROPIETARIO Y MASCOTA (MODIFICADA) --- */}
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

                        {/* --- SECCIÓN DE DETALLES DE LA CITA (MODIFICADA) --- */}
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
                                maxLength={500} 
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