import React from 'react';
import '../Estilos_F/Servicios.css'

function Servicios() {
  return (
    <section className="servicios-seccion">
      <div className="servicios-encabezado">
        <h1>Somos más que una veterinaria</h1>
        <p>
          Ofrecemos una amplia gama de servicios pensados en ti y tus mascotas, gracias a los cuales, maximizamos su
          calidad de vida previniendo y asegurando su bienestar, mientras los cuidamos y consentimos en cada momento.
        </p>
      </div>
      <div className="servicios-contenedor">
        
        <div className="tarjeta-servicio">
          <div className="imagen-contenedor">
            <img
              src="https://raw.githubusercontent.com/Nore0729/Img-soft-veterinario/refs/heads/main/Bienestar.jpg"
              alt="Servicio de Bienestar"
              className="imagen-servicio"
            />
            <div className="overlay-titulo">
              <h3>Bienestar</h3>
            </div>
          </div>

          <div className="contenido-servicio">
            <ul>
              <li>
                <span className="check-icon">✓</span>Vacunación
              </li>
              <li>
                <span className="check-icon">✓</span>Baño y estética
              </li>
              <li>
                <span className="check-icon">✓</span>Profilaxis dental
              </li>
            </ul>
          </div>
        </div>
        <div className="tarjeta-servicio">
          <div className="imagen-contenedor">
            <img
              src="https://raw.githubusercontent.com/Nore0729/Img-soft-veterinario/refs/heads/main/operar.jpg"
              alt="Servicio de Urgencias"
              className="imagen-servicio"
            />
            <div className="overlay-titulo">
              <h3>Urgencias</h3>
            </div>
          </div>

          <div className="contenido-servicio">
            <ul>
              <li>
                <span className="check-icon">✓</span>Atención 24 horas
              </li>
            </ul>
          </div>
        </div>

    
        <div className="tarjeta-servicio">
          <div className="imagen-contenedor">
            <img
              src="https://raw.githubusercontent.com/Nore0729/Img-soft-veterinario/refs/heads/main/ortopedia.jpg"
              alt="Servicio de Cirugías"
              className="imagen-servicio"
            />
            <div className="overlay-titulo">
              <h3>Cirugías</h3>
            </div>
          </div>

          <div className="contenido-servicio">
            <ul>
              <li>
                <span className="check-icon">✓</span>Esterilización
              </li>
            </ul>
          </div>
        </div>

        <div className="tarjeta-servicio">
          <div className="imagen-contenedor">
            <img
              src="https://raw.githubusercontent.com/Nore0729/Img-soft-veterinario/refs/heads/main/hospital.jpg"
              alt="Servicio de Especialidades"
              className="imagen-servicio"
            />
            <div className="overlay-titulo">
              <h3>Especialidades</h3>
            </div>
          </div>

          <div className="contenido-servicio">
            <ul>
              <li>
                <span className="check-icon">✓</span>Ortopedia
              </li>
              <li>
                <span className="check-icon">✓</span>Cardiología
              </li>
              <li>
                <span className="check-icon">✓</span>Oftalmología
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Servicios