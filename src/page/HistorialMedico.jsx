import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import HistorialMedico from './HistorialMedico';

const HistorialMedicoWrapper = () => {
  const { mascotaId } = useParams();
  const [historial, setHistorial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await axios.get(`/api/historial/${mascotaId}`);
        setHistorial(res.data);
      } catch (error) {
        console.error('Error al cargar historial médico:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [mascotaId]);

  if (loading) return <p>Cargando...</p>;

  return <HistorialMedico historial={historial} />;
};

export default HistorialMedicoWrapper;