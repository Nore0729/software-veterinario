import { useEffect, useState } from 'react';
import axios from 'axios';

const MisMascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historiales, setHistoriales] = useState({});
  const [mostrarHistorial, setMostrarHistorial] = useState({});

  useEffect(() => {
    const storedDoc = localStorage.getItem('doc_pro');

    if (storedDoc) {
      const fetchMascotas = async () => {
        try {
          const res = await axios.get(`/api/mascotas/propietario/${storedDoc}`);
          setMascotas(res.data);
        } catch (err) {
          console.error('Error al cargar mascotas:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchMascotas();
    } else {
      setLoading(false);
    }
  }, []);

  const toggleHistorial = async (mascotaId) => {
    setMostrarHistorial((prev) => ({
      ...prev,
      [mascotaId]: !prev[mascotaId],
    }));

    // Solo cargar historial si no está en memoria
    if (!historiales[mascotaId]) {
      try {
        const res = await axios.get(`/api/historial/${mascotaId}`);
        setHistoriales((prev) => ({
          ...prev,
          [mascotaId]: res.data,
        }));
      } catch (error) {
        console.error(`Error al obtener historial de la mascota ${mascotaId}:`, error);
      }
    }
  };

  if (loading) return <p>Cargando mascotas...</p>;

  return (
    <div>
      <h2>Mis Mascotas</h2>
      {mascotas.length === 0 ? (
        <p>No tienes mascotas registradas.</p>
      ) : (
        <ul>
          {mascotas.map((mascota) => (
            <li key={mascota.id} style={{ marginBottom: '30px', listStyle: 'none' }}>
              <strong>{mascota.nombre}</strong> - {mascota.especie}, {mascota.raza}
              <br />
              <button onClick={() => toggleHistorial(mascota.id)}>
                {mostrarHistorial[mascota.id] ? 'Ocultar historial' : 'Ver historial clínico'}
              </button>

              {mostrarHistorial[mascota.id] && (
                <div style={{ marginTop: '10px', paddingLeft: '15px' }}>
                  <h4>Historial Clínico</h4>
                  {historiales[mascota.id] ? (
                    historiales[mascota.id].length > 0 ? (
                      <table border="1" cellPadding="5" style={{ marginTop: '10px' }}>
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Motivo</th>
                            <th>Veterinario</th>
                            <th>Diagnóstico</th>
                            <th>Tratamiento</th>
                            <th>Recomendaciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historiales[mascota.id].map((registro) => (
                            <tr key={registro.id}>
                              <td>{new Date(registro.fecha_consulta).toLocaleDateString()}</td>
                              <td>{registro.motivo_consulta}</td>
                              <td>{registro.nombre_veterinario || 'No registrado'}</td>
                              <td>{registro.diagnostico}</td>
                              <td>{registro.tratamiento}</td>
                              <td>{registro.recomendaciones}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No hay historial registrado para esta mascota.</p>
                    )
                  ) : (
                    <p>Cargando historial...</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MisMascotas;
