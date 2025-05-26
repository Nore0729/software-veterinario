// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Componentes/MainLayout";
import Privado from "./Componentes/privado";
import PagPrincipal from "./Componentes/PagPrincipal";
import Login from "./Componentes/Login";
import Citas from "./Componentes/Citas";
import Propietarios from "./Componentes/Propietarios";
import Ayuda from "./Componentes/Ayuda";
import Servicios from "./Componentes/Servicios";
import Mascotas from "./Componentes/Mascotas";
import PoliticasP from "./Componentes/PoliticasP";
import Ubicacion from "./Componentes/Ubicacion";
import Usuarios from "./Componentes/Usuarios";
import Roles from "./Componentes/Roles";
import MasRegis from "./Componentes/MasRegis";
import Veterinarios from "./Componentes/Veterinarios";
import RecuperarContraseña from "./Componentes/Recuperarcontraseña";
import Admin from "./Componentes/Admin";

// Rutas para usuario logueado con menú lateral
import UserLayout from "./Componentes/UserLayout";
import UserWelcome from "./Componentes/UserWelcome";
import DatosPro from "./Componentes/Datospro";
import Ayudapro from "./Componentes/ayudapro";
import Actualizarpro from "./Componentes/Actualizarpro";
// import FichaFirulais from "./Componentes/FichaFirulais";
// import FichaMichi from "./Componentes/FichaMichi";
// import CitasProximas from "./Componentes/CitasProximas";
// import HistorialCitas from "./Componentes/HistorialCitas";
// import Recordatorios from "./Componentes/Recordatorios";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas públicas con header/footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<PagPrincipal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/propietarios" element={<Propietarios />} />
          <Route path="/ayuda" element={<Ayuda />} />
          <Route path="/mascotas" element={<Mascotas />} />
          <Route path="/PoliticasP" element={<PoliticasP />} />
          <Route path="/Ubicacion" element={<Ubicacion />} />
          <Route path="/Usuarios" element={<Usuarios />} />
          <Route path="/Roles" element={<Roles />} />
          <Route path="/Recuperarcontraseña" element={<RecuperarContraseña />} />
          <Route path="/MasRegis" element={<MasRegis />} />
          <Route path="/Veterinarios" element={<Veterinarios />} />
          <Route path="/AyudaU" element={<AyudaU />} />
        </Route>

        {/* Rutas protegidas (admin o similares) */}
        <Route element={<Privado />}>
          <Route path="/Admin" element={<Admin />} />
        </Route>

        {/* Rutas con menú lateral del usuario logueado */}
        <Route element={<UserLayout />}>
          <Route path="/UserWelcome" element={<UserWelcome />} />
          <Route path="/Datospro" element={<DatosPro />} />
          <Route path="/Ayudapro" element={<Ayudapro />} />
          <Route path="/Actualizarpro" element={<Actualizarpro />} /> 
          {/* <Route path="/mascota/firulais" element={<FichaFirulais />} />
          <Route path="/mascota/michi" element={<FichaMichi />} />
          <Route path="/citas-proximas" element={<CitasProximas />} />
          <Route path="/historial-citas" element={<HistorialCitas />} />
          <Route path="/recordatorios" element={<Recordatorios />} /> */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

