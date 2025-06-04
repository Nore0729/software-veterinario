import React from 'react';
import MenuAdmin from '../Administrador/MenuAdmin';
import "../../Estilos_F/Administrador/AdminLayout.css"

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