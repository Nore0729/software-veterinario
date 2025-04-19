import { BrowserRouter, Routes, Route } from "react-router-dom"
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
import Administrador from "./Componentes/Administrador"
import Contraseña1 from "./Componentes/Contraseña1"
import Contraseña2 from "./Componentes/Contraseña2"
import UserWelcome from "./Componentes/UserWelcome"



function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<PagPrincipal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/citas" element={<Citas />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/propietarios" element={<Propietarios />} />
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="/mascotas" element={<Mascotas />} />
        <Route path="/PoliticasP" element={<PoliticasP />} />
        <Route path="/Administrador" element={<Administrador />} />
        <Route path="/Contraseña1" element={<Contraseña1/>}/>
        <Route path="/Contraseña2" element={<Contraseña2/>}/>
        <Route path="/UserWelcome" element={<UserWelcome/>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
