
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { About } from "./pages/About"

import { Equipo } from "./pages/Equipo"


import { BrowserRouter,Routes , Route } from "react-router-dom"
import {EscuelasPage} from "./pages/EscuelasPage"

function App() {
  
  return (

      <BrowserRouter >
      <Header />

      <Routes >
        <Route path="/" element={<About/>} />
        <Route path="/Nosotros" element={<Equipo/>}/>
        <Route path="/Escuelas" element={<EscuelasPage/>}/>
      </Routes>


      
      <Footer/>
      </BrowserRouter>     
  )
}

export default App
