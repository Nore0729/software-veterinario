import { useEffect, useState } from 'react';
import axios from 'axios';

const MisMascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  console.log("alalalalla")
  useEffect(() => {
    const storedDoc = localStorage.getItem('doc_pro');
    
    if (storedDoc) {
      const fetchMascotas = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/api/mis-mascotas/${storedDoc}`);
          console.log(res.data)
          setMascotas(res.data);
        } catch (err) {
          console.error('Error al cargar mascotas:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchMascotas();
    } else {
      setLoading(false); // Si no hay doc, detenemos el loading
    }
  }, []);
  
  
  if (loading) return <p>Cargando mascotas...</p>;
  
  return (
    <div>
      <h2>Mis Mascotas</h2>
      {mascotas.length === 0 ? (
        <p>No tienes mascotas registradaaas.</p>
      ) : (
        <ul>
          {mascotas?.map((mascota) => (
            <li key={mascota.id}>
              <strong>{mascota.nombre}</strong> - {mascota.especie}, {mascota.raza}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MisMascotas;
