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
import Clientes from "./Componentes/Clientes";
import Roles from "./Componentes/Roles";
import Veterinarios from "./Componentes/Veterinarios";
import RecuperarContraseña from "./Componentes/Recuperarcontraseña";
import Admin from "./Componentes/Admin";
import UserWelcome from "./Componentes/UserWelcome";
import DatosPro from "./Componentes/Datospro";
import Ayudapro from "./Componentes/ayudapro";
import HistorialMedico from "./Componentes/HistorialMedico";
import Pacientes from "./Componentes/Pacientes";
import Consultas from "./Componentes/Consultas";
import VeterinarioPer from "./Componentes/VeterinarioPer";
import MenuAdmin from "./Componentes/MenuAdmin";
import InicioAdmin from "./Componentes/InicioAdmin";
import FormularioUsu from "./PanelAdmin/FormularioUsu";
import ServiciosAdmin from "./Componentes/ServiciosAdmin";
import UserLayout from "./Componentes/UserLayout"; // Añadir esta importación
import Actualizarpro from "./Componentes/Actualizarpro"; // Añadir esta importación
import AyudaU from "./Componentes/AyudaU"; // Añadir esta importación
import CookieConsent from "./Componentes/CookieConsent"; // Añadir esta importación

function App() {
  return (
    <BrowserRouter>
      <CookieConsent />
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
          <Route path="/Recuperarcontraseña" element={<RecuperarContraseña />} />
          <Route path="/Pacientes" element={<Pacientes />} />
          <Route path="/Consultas" element={<Consultas />} />
          <Route path="/HistorialMedico" element={<HistorialMedico />} /> {/* Corregido: espacio eliminado */}
          <Route path="/Veterinarios" element={<Veterinarios />} />
          <Route path="/AyudaU" element={<AyudaU />} />
        </Route>

        {/* Rutas protegidas (admin o similares) */}
        <Route element={<Privado />}>
          <Route path="/FormularioUsu" element={<FormularioUsu />} />
          <Route path="/InicioAdmin" element={<InicioAdmin />} />
          <Route path="/MenuAdmin" element={<MenuAdmin />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/Clientes" element={<Clientes />} />
          <Route path="/Roles" element={<Roles />} />
          <Route path="/ServiciosAdmin" element={<ServiciosAdmin />} />
          <Route path="/VeterinarioPer" element={<VeterinarioPer />} />
        </Route>

        {/* Rutas con menú lateral del usuario logueado */}
        <Route element={<UserLayout />}>
          <Route path="/UserWelcome" element={<UserWelcome />} />
          <Route path="/Datospro" element={<DatosPro />} />
          <Route path="/Ayudapro" element={<Ayudapro />} />
          <Route path="/Actualizarpro" element={<Actualizarpro />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;