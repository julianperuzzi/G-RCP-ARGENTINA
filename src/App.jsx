
import  Header  from "./components/Header"
import { Footer } from "./components/Footer"
import { About } from "./pages/About"

import { Equipo } from "./pages/Equipo"


import { BrowserRouter,Routes , Route } from "react-router-dom"
import {EscuelasPage} from "./pages/EscuelasPage"
import BlogPage from "./pages/BlogPage"
function App() {
  
  return (

      <BrowserRouter >

      <Header/>

      <Routes >
        <Route path="/" element={<About/>} />
        <Route path="/Nosotros" element={<Equipo/>}/>
        <Route path="/Escuelas" element={<EscuelasPage/>}/>
        <Route path="/News" element={<BlogPage/>}/>

      </Routes>


      
      <Footer/>
      </BrowserRouter>     
  )
}

export default App
