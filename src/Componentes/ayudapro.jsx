import React from 'react';
import { Link } from 'react-router-dom';
import '../Estilos_F/Ayuda.css';
import { Mail, Phone, Clock, MapPin, Users, ChevronRight } from "lucide-react"

function Ayudapro() {
  return (
    <>
      <div className="ayuda">
        <h1 className="ayuda-titulo">Centro de Ayuda al Usuario Pet Lovers</h1>
        <p className="ayuda-subtitulo">Encuentra respuestas a tus preguntas o contáctanos directamente</p>
        <div className="ayuda-columnas">
          <div className="ayuda-columna">
            <div className="ayuda-seccion">
              <h2>
                <ChevronRight className="icono" /> Preguntas Frecuentes
              </h2>
              <ul>
                <li>
                  <Link to="#">¿Cómo agendar una cita?</Link>
                </li>
                <li>
                  <Link to="#">¿Cuáles son los métodos de pago aceptados?</Link>
                </li>
                <li>
                  <Link to="#">¿Qué servicios veterinarios ofrecen?</Link>
                </li>
                <li>
                  <Link to="#">¿Cómo cancelar o reprogramar una cita?</Link>
                </li>
                <li>
                  <Link to="#">¿Ofrecen servicios de emergencia?</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="ayuda-columna">
            <div className="ayuda-seccion">
              <h2>
                <Users className="icono" /> Contacto y Soporte
              </h2>
              <p>Nuestro equipo está disponible para ayudarte:</p>
              <div className="contacto-info">
                <p>
                  <Mail className="icono" /> Email: soporte@lovers.com
                </p>
                <p>
                  <Phone className="icono" /> Teléfono: +57 321 497 2645
                </p>
                <p>
                  <Clock className="icono" /> Horario: Lunes a Viernes 8am - 6pm / Sábados 9am - 2pm
                </p>
                <p>
                  <MapPin className="icono" /> Dirección: Cra 45 #26-85, Bogotá
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Ayudapro;