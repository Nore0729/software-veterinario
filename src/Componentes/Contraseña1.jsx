import React, { useState } from "react";
import '../Estilos_F/Contraseña1.css';

const RecuperarContraseña = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (!email) {
      setError("Por favor, ingresa tu correo.");
      setMensaje("");
      return;
    } 
    
    setTimeout(() => {
      setMensaje("¡Hemos enviado un enlace de recuperación a tu correo!");
      setError("");
    }, 1000);
  };

  return (
    <div className="recuperar-container">
      <div className="recuperar-form-wrapper">
        <h2 className="recuperar-titulo">¿Olvidaste tu contraseña?</h2>
        <form className="recuperar-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={error ? "recuperar-input-error" : ""}
          />
          {error && <p className="recuperar-error">{error}</p>}
          <button type="submit">Enviar enlace de recuperación</button>
        </form>
        {mensaje && <p className="recuperar-confirmacion">{mensaje}</p>}
      </div>
    </div>
  );
};

export default RecuperarContraseña;

