import React, { useState } from "react";
import "../styles/Servicios.css";

// Datos de servicios con SVG inline para los iconos
const services = [
  {
    id: 1,
    title: "Consulta General",
    shortDescription: "Evaluación completa de la salud de tu mascota",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
        <circle cx="20" cy="10" r="2"></circle>
      </svg>
    ),
    fullDescription: "Nuestro servicio de consulta general incluye un examen físico completo, evaluación de signos vitales, revisión de historial médico y recomendaciones personalizadas para el cuidado de tu mascota. Nuestros veterinarios altamente calificados están comprometidos a proporcionar el mejor cuidado posible.",
    price: "$80.000 - $120.000 COP",
    duration: "30 minutos"
  },
  {
    id: 2,
    title: "Vacunación",
    shortDescription: "Protección esencial contra enfermedades comunes",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m14.5 4-2-2-8 8 2 2"></path>
        <path d="m4.5 12 8 8 2-2"></path>
        <path d="m20 6-2-2"></path>
        <path d="m20 14-8-8"></path>
        <path d="m20 14-2 2-8-8 2-2z"></path>
      </svg>
    ),
    fullDescription: "Ofrecemos un programa completo de vacunación para perros y gatos de todas las edades. Nuestras vacunas de alta calidad protegen contra enfermedades como rabia, parvovirus, moquillo, hepatitis y más. Desarrollamos un calendario personalizado según las necesidades específicas de tu mascota.",
    price: "$70.000 - $150.000 COP",
    duration: "15 minutos"
  },
  {
    id: 3,
    title: "Peluquería",
    shortDescription: "Estética y cuidado del pelaje profesional",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3"></circle>
        <path d="M8.5 8.5 11 11"></path>
        <path d="m11.5 12.5 2 2"></path>
        <path d="m16.5 17.5 2 2"></path>
        <path d="M3 21 8 16"></path>
        <path d="m13 13 8 8"></path>
        <path d="m13.5 7.5 5 5"></path>
        <path d="M19 2 7 14"></path>
      </svg>
    ),
    fullDescription: "Nuestro servicio de peluquería incluye baño con champú especializado, secado, cepillado, corte de pelo según la raza, limpieza de oídos, corte de uñas y perfumado. Contamos con peluqueros experimentados que saben manejar mascotas nerviosas con paciencia y cariño.",
    price: "$50.000 - $120.000 COP",
    duration: "1-2 horas"
  },
  {
    id: 4,
    title: "Baño y Desparasitación",
    shortDescription: "Higiene completa interna y externa",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path>
        <line x1="10" y1="5" x2="8" y2="7"></line>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <line x1="7" y1="19" x2="7" y2="21"></line>
        <line x1="17" y1="19" x2="17" y2="21"></line>
      </svg>
    ),
    fullDescription: "Combinamos un baño terapéutico con productos de alta calidad junto con un tratamiento desparasitante interno y externo. Eliminamos pulgas, garrapatas y parásitos intestinales en una sola sesión, dejando a tu mascota limpia y protegida.",
    price: "$60.000 - $100.000 COP",
    duration: "45 minutos"
  },
  {
    id: 5,
    title: "Farmacia Veterinaria",
    shortDescription: "Medicamentos y suplementos especializados",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m17 3-5 5-5-5h10"></path>
        <path d="M17 21H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4"></path>
        <path d="M16 16h.01"></path>
        <path d="M12 12h.01"></path>
        <path d="M8 8h.01"></path>
        <path d="M16 8h.01"></path>
        <path d="M12 16h.01"></path>
        <path d="M8 16h.01"></path>
      </svg>
    ),
    fullDescription: "Nuestra farmacia veterinaria está completamente surtida con medicamentos, antibióticos, antiparasitarios, suplementos nutricionales y alimentos especializados. Ofrecemos asesoramiento sobre la administración correcta y seguimiento para asegurar la efectividad del tratamiento.",
    price: "Varía según producto",
    duration: "N/A"
  },
  {
    id: 6,
    title: "Especialidades",
    shortDescription: "Atención especializada para casos complejos",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"></path>
        <path d="M14.5 5.17c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.344-2.5"></path>
        <path d="M8 14v.5"></path>
        <path d="M16 14v.5"></path>
        <path d="M11.25 16.25h1.5L12 17l-.75-.75Z"></path>
        <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"></path>
      </svg>
    ),
    fullDescription: "Contamos con especialistas en dermatología, cardiología, oftalmología, ortopedia y odontología veterinaria. Para casos que requieren atención especializada, nuestros expertos utilizan equipamiento avanzado para diagnóstico y tratamiento de condiciones complejas.",
    price: "$120.000 - $300.000 COP",
    duration: "45-60 minutos"
  }
];

function PanelServicios() {
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="service-panel-container">
      <h1 className="service-panel-title">Servicios Veterinarios PetLovers</h1>
      <p className="service-panel-description">
        Ofrecemos una amplia gama de servicios para el cuidado y bienestar de tu mascota
      </p>
      
      <div className="service-grid">
        {services.map((service) => (
          <div 
            key={service.id} 
            className="service-card"
            onClick={() => handleServiceClick(service)}
          >
            <div className="service-card-content">
              <div className="service-icon-container">
                {service.icon}
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.shortDescription}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedService && (
        <div className="service-modal-backdrop" onClick={closeModal}>
          <div className="service-modal" onClick={(e) => e.stopPropagation()}>
            <div className="service-modal-header">
              <h3 className="service-modal-title">{selectedService.title}</h3>
              <button className="service-modal-close-x" onClick={closeModal}>×</button>
            </div>
            <p className="service-modal-description">{selectedService.fullDescription}</p>
            
            <div className="service-modal-details">
              <div className="service-modal-detail">
                <span className="service-modal-label">Precio:</span>
                <span className="service-modal-value">{selectedService.price}</span>
              </div>
              <div className="service-modal-detail">
                <span className="service-modal-label">Duración:</span>
                <span className="service-modal-value">{selectedService.duration}</span>
              </div>
            </div>
            
            <div className="service-modal-actions">
              <button className="service-modal-close" onClick={closeModal}>
                Cerrar
              </button>
              <button className="service-modal-reserve"
               onClick={() => window.location.href = "/Login"}
              >
                Reservar Cita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PanelServicios;