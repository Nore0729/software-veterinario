import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import PagPrincipal from "./Componentes/PagPrincipal"
import Login from "./Componentes/Login"
import Citas from "./Componentes/Citas"
import Propietarios from "./Componentes/Propietarios"
import Ayuda from "./Componentes/Ayuda"
import Header from "./Componentes/Header"
import Servicios from "./Componentes/Servicios"
import Footer from "./Componentes/Footer"
import Mascotas from "./Componentes/Mascotas"
import PoliticasP from "./Componentes/PoliticasP"
import Contraseña1 from "./Componentes/Contraseña1"
import Contraseña2 from "./Componentes/Contraseña2"
import UserWelcome from "./Componentes/UserWelcome"
import Ubicacion from "./Componentes/Ubicacion"
import Admin from "./Componentes/Admin"
import Usuarios from "./Componentes/Usuarios"
import Roles from "./Componentes/Roles"
import MasRegis from "./Componentes/MasRegis"
import Veterinarios from "./Componentes/Veterinarios"

function AppWrapper() {
  const location = useLocation()
  const noMostrarHeaderFooter = ["/Admin", "/UserWelcome"]
  const mostrarHeaderFooter = !noMostrarHeaderFooter.includes(location.pathname)
  return (
    <>
      {mostrarHeaderFooter && <Header />}
      
      <Routes>
        <Route path="/" element={<PagPrincipal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/citas" element={<Citas />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/propietarios" element={<Propietarios />} />
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="/mascotas" element={<Mascotas />} />
        <Route path="/PoliticasP" element={<PoliticasP />} />
        <Route path="/Contraseña1" element={<Contraseña1 />} />
        <Route path="/Contraseña2" element={<Contraseña2 />} />
        <Route path="/Ubicacion" element={<Ubicacion />} />
        <Route path="/Usuarios" element={<Usuarios />} />
        <Route path="/Roles" element={<Roles />} />
        <Route path="/MasRegis" element={<MasRegis />} />
        <Route path="/Veterinarios" element={<Veterinarios />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/UserWelcome" element={<UserWelcome />} />
      </Routes>
      {mostrarHeaderFooter && <Footer />}
    </>
  )
}
function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  )
}

export default App
