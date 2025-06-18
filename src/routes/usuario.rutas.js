// src/routes/usuario.rutas.js
import React from 'react';
import { Route } from 'react-router-dom';

// Importa tus componentes de Usuario
import UserWelcome from '../page/UserWelcome';
import DatosPro from '../page/Datospro';
import Ayudapro from '../page/ayudapro';
import Actualizarpro from '../page/Actualizarpro';
import AgendarCita from "../page/AgendarCita"

const UserSpecificRoutes = () => (
  <>
    <Route path="/UserWelcome" element={<UserWelcome />} />
    <Route path="/Datospro" element={<DatosPro />} />
    <Route path="/Ayudapro" element={<Ayudapro />} />
    <Route path="/Actualizarpro" element={<Actualizarpro />} />
    <Route path="/AgendarCita" element={<AgendarCita />} />
  </>
);

export default UserSpecificRoutes;