import React from 'react';
import MenuAdmin from '../Componentes/MenuAdmin';
import '../Estilos_F/AdminLayout.css'; 

function AdminLayout({ children }) {
  return (
    <div className="admin-layout-container">
      <MenuAdmin />
      <div className="admin-content-wrapper">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;