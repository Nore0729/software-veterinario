import Header from "../Componentes/Header"
import Footer from "../Componentes/Footer"
import { Outlet } from "react-router-dom"

const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default MainLayout
