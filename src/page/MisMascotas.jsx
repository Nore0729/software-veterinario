import { useEffect, useState } from 'react';
import axios from 'axios';

const MisMascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doc, setDoc] = useState('');

  useEffect(() => {
    const storedDoc = localStorage.getItem('doc');
    setDoc(storedDoc);
    
    if (storedDoc) {
      axios.get(`/api/mis-mascotas/${storedDoc}`)
        .then(res => {
          setMascotas(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error al cargar mascotas:', err);
          setLoading(false);
        });
    }
  }, []);

  if (loading) return <p>Cargando mascotas...</p>;

  return (
    <div>
      <h2>Mis Mascotas</h2>
      {mascotas.length === 0 ? (
        <p>No tienes mascotas registradas.</p>
      ) : (
        <ul>
          {mascotas.map((mascota) => (
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
