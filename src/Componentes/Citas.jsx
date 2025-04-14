import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../Estilos_F/Citas.css'

function Citas() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        mode: 'onChange',
    });

    const navigate = useNavigate();

    const redirigirAlInicio = () => {
        navigate('/');
    };

    const onSubmit = (data) => console.log(data);
    const selectedService = watch("service");
    const selectedDate = watch("date");

    const validarFecha = (date) => {
        const today = new Date();
        const selected = new Date(date);
        return selected >= today || "La fecha no puede ser en el pasado";
    };

    const services = [
        { id: 'consult', name: 'Consulta General', duration: 30 },
        { id: 'cleaning', name: 'Limpieza Dental', duration: 45 },
        { id: 'ortho', name: 'Ortodoncia', duration: 60 },
        { id: 'surgery', name: 'Cirugía', duration: 120 },
    ];

    const availableTimes = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
    ];

    return (
        <>
            <div className="cita-contenedor">
                <div className="cita-formulario-contenedor">
                    <div className="cita-formulario">
                        <h1 className="cita-titulo">Agendar Nueva Cita</h1>

                        <div className="cita-secciones">
                            <div className="cita-seccion">
                                <h2 className="cita-subtitulo">ID de la Mascota</h2>

                                <label className="cita-label">ID de la Mascota *</label>
                                <input
                                type="text"
                                placeholder="ID de la mascota"
                                className={`cita-input ${errors.petId ? 'input-error' : ''}`}
                                {...register('petId', { 
                                    required: "El ID de la mascota es obligatorio",
                                    minLength: { value: 3, message: "Mínimo 3 dígitos" },
                                    maxLength: { value: 10, message: "Máximo 10 dígitos" },
                                    pattern: { 
                                    value: /^[0-9]+$/, 
                                    message: "El ID solo puede contener números" 
                                    }
                                })}
                                maxLength={10} 
                                onInput={(e) => {e.target.value = e.target.value.replace(/\D/g, ''); 
                                }}
                            />
                            {errors.petId && <p className="error-text">{errors.petId.message}</p>}
                            </div>
                            <div className="cita-seccion">
                                <h2 className="cita-subtitulo">Datos del Propietario</h2>

                                <label className="cita-label">Nombre del Propietario *</label>
                                <input
                                    type="text"
                                    placeholder="Nombre completo"
                                    className={`cita-input ${errors.ownerName ? 'input-error' : ''}`}
                                    {...register('ownerName', { 
                                        required: "El nombre es obligatorio",
                                        minLength: { value: 3, message: "Mínimo 3 caracteres" },
                                        maxLength: { value: 50, message: "Máximo 50 caracteres" },
                                        pattern: { 
                                            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,  
                                            message: "Solo se permiten letras y espacios" 
                                        }
                                    })}
                                    maxLength={50} 
                                    onInput={(e) => {e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); 
                                    }}
                                />
                                {errors.ownerName && <p className="error-text">{errors.ownerName.message}</p>}

                                <label className="cita-label">Teléfono del Propietario *</label>
                                <input
                                    type="tel"
                                    placeholder="Teléfono"
                                    className={`cita-input ${errors.ownerPhone ? 'input-error' : ''}`}
                                    {...register('ownerPhone', { 
                                        required: "El teléfono es obligatorio",
                                        pattern: { value: /^[0-9]+$/, message: "Solo números" },
                                        minLength: { value: 7, message: "Mínimo 7 dígitos" },
                                        maxLength: { value: 15, message: "Máximo 15 dígitos" }
                                    })}
                                    maxLength={15} 
                                    onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                />
                                {errors.ownerPhone && <p className="error-text">{errors.ownerPhone.message}</p>}
                            </div>
                            <div className="cita-seccion">
                                <h2 className="cita-subtitulo">Detalles de la Cita</h2>

                                <label className="cita-label">Servicio *</label>
                                <div className="cita-opciones-servicio">
                                    {services.map(service => (
                                        <label key={service.id} className={`cita-opcion-servicio ${selectedService === service.id ? 'cita-seleccionado' : ''}`}>
                                            <input
                                                type="radio"
                                                value={service.id}
                                                style={{ display: 'none' }}
                                                {...register('service', { required: "Selecciona un servicio" })}
                                            />
                                            <div className="cita-servicio-contenido">
                                                <h3 className="cita-servicio-nombre">{service.name}</h3>
                                                <p className="cita-servicio-duracion">{service.duration} minutos</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.service && <p className="error-text">{errors.service.message}</p>}
                            </div>
                            <div className="cita-seccion">
                                <div className="cita-seleccion-fecha">
                                    <label className="cita-label">Fecha *</label>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        className={`cita-input ${errors.date ? 'input-error' : ''}`}
                                        {...register('date', { 
                                            required: "La fecha es obligatoria",
                                            validate: validarFecha
                                        })}
                                    />
                                    {errors.date && <p className="error-text">{errors.date.message}</p>}
                                </div>
                                <div className="cita-seleccion-hora">
                                    <label className="cita-label">Hora *</label>
                                    <select
                                        className={`cita-input ${errors.time ? 'input-error' : ''}`}
                                        {...register('time', { required: "Selecciona una hora" })}
                                    >
                                        <option value="">Selecciona hora</option>
                                        {availableTimes.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                    {errors.time && <p className="error-text">{errors.time.message}</p>}
                                </div>
                            </div>
                            <div className="cita-seccion">
                                <label className="cita-label">Notas adicionales</label>
                                <textarea
                                    placeholder="Alguna información adicional que debamos conocer"
                                    rows="3"
                                    className="cita-textarea"
                                    {...register('notes', {
                                        maxLength: { value: 500, message: "Máximo 500 caracteres" }
                                    })}
                                    maxLength={500} 
                                ></textarea>
                                {errors.notes && <p className="error-text">{errors.notes.message}</p>}
                            </div>
                            <div className="cita-seccion">
                                <div className="cita-recordatorio-contenedor">
                                    <div className="cita-recordatorio">
                                        <input
                                            type="checkbox"
                                            id="reminders"
                                            className="cita-recordatorio-input"
                                            {...register('reminders')}
                                        />
                                        <label htmlFor="reminders" className="cita-recordatorio-texto">
                                            Deseo recibir recordatorios de mi cita
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="cita-boton-enviar" onClick={handleSubmit(onSubmit)}>
                            Confirmar Cita
                        </button>
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default Citas;