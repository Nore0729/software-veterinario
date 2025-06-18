// src/routes/admin.rutas.js
import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';

// Importa tus componentes de Administrador
import FormularioUsu from '../page/admin/FormularioUsu';
import InicioAdmin from '../page/admin/InicioAdmin';
import MenuAdmin from '../page/admin/MenuAdmin';
import Admin from '../page/admin/Admin';
import Clientes from '../page/admin/Clientes';
import Roles from '../page/admin/Roles';
import Veterinarios from '../page/admin/Veterinarios'
import ServiciosAdmin from '../page/admin/ServiciosAdmin';

const AdminRoutes = () => {
  useEffect(() => {
    localStorage.getItem('rol') === 'administrador'?
  })

  return (
  <>
    <Route path="/FormularioUsu" element={<FormularioUsu />} />
    <Route path="/InicioAdmin" element={<InicioAdmin />} />
    <Route path="/MenuAdmin" element={<MenuAdmin />} />
    <Route path="/Admin" element={<Admin />} />
    <Route path="/Clientes" element={<Clientes />} />
    <Route path="/Roles" element={<Roles />} />
    <Route path="/Veterinarios" element={<Veterinarios />} />
    <Route path="/ServiciosAdmin" element={<ServiciosAdmin />} />
  </>)
};

export default AdminRoutes;