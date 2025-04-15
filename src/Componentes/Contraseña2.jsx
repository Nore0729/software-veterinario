import React, { useState } from "react";
import '../Estilos_F/Contraseña2.css';

function CambiarPassword() {
  const [claveUno, setClaveUno] = useState('');
  const [claveDos, setClaveDos] = useState('');
  const [alerta, setAlerta] = useState('');

  const validarClaves = (evento) => {
    evento.preventDefault();
    if (claveUno === claveDos) {
      setAlerta("La contraseña ha sido cambiada exitosamente.");
    } else {
      setAlerta("Las contraseñas ingresadas no coinciden.");
    }
  };

  return (
    <div className="fondo-formulario">
      <div className="formulario-restablecer">
        <form onSubmit={validarClaves}>
          <h1>Restablecer contraseña</h1>

          <div>
            <label htmlFor="claveUno">Nueva contraseña:</label>
            <input 
              type="password" 
              id="claveUno" 
              value={claveUno} 
              onChange={(e) => setClaveUno(e.target.value)} 
              placeholder="Introduce tu nueva contraseña"
              required 
            />
          </div>

          <div>
            <label htmlFor="claveDos">Confirmar contraseña:</label>
            <input 
              type="password" 
              id="claveDos" 
              value={claveDos} 
              onChange={(e) => setClaveDos(e.target.value)} 
              placeholder="Confirma tu contraseña"
              required 
            />
          </div>

          <button type="submit">Cambiar contraseña</button>
          {alerta && (
            <p style={{ color: claveUno === claveDos ? 'green' : 'red' }}>
              {alerta}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default CambiarPassword;



