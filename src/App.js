import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./Componentes/MainLayout"
import Privado from "./Componentes/privado"
import PagPrincipal from "./Componentes/PagPrincipal"
import Login from "./Componentes/Login"
import Citas from "./Componentes/Citas"
import Propietarios from "./Componentes/Propietarios"
import Ayuda from "./Componentes/Ayuda"
import Servicios from "./Componentes/Servicios"
import Mascotas from "./Componentes/Mascotas"
import PoliticasP from "./Componentes/PoliticasP"
import Ubicacion from "./Componentes/Ubicacion"
import Usuarios from "./Componentes/Usuarios"
import Roles from "./Componentes/Roles"
import MasRegis from "./Componentes/MasRegis"
import Veterinarios from "./Componentes/Veterinarios"
import RecuperarContraseña from "./Componentes/Recuperarcontraseña"
import Admin from "./Componentes/Admin"
import UserWelcome from "./Componentes/UserWelcome"
import DatosPro from "./Componentes/Datospro"
import Ayudapro from "./Componentes/ayudapro"
import HistorialMedico from "./Componentes/HistorialMedico"
import Pacientes from "./Componentes/Pacientes"
import Consultas from "./Componentes/Consultas"
import VeterinarioPer from "./Componentes/VeterinarioPer"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas normales con header/footer */}
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
          <Route path="/Pacientes" element={<Pacientes />} />
          <Route path="/Consultas" element={<Consultas />} />
          <Route path="/ HistorialMedico" element={< HistorialMedico />} />
        </Route>

        {/* Rutas internas sin header/footer */}
        <Route element={<Privado />}>
          <Route path="/Admin" element={<Admin />} />
          <Route path="/UserWelcome" element={<UserWelcome />} />
          <Route path="/Datospro" element={<DatosPro />} />
          <Route path="/ayudapro" element={<Ayudapro />} />
          <Route path="/VeterinarioPer" element={<VeterinarioPer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
