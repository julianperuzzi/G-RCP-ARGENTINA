import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Importamos BrowserRouter como Router
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import { Footer } from './components/Footer';
import { About } from './pages/About';
import { Equipo } from './pages/Equipo';
import { EscuelasPage } from './pages/EscuelasPage';
import BlogPage from './pages/BlogPage';
import AprendeRCP from './pages/AprendeRCP';
import ServiciosPages from './pages/ServiciosPages';
import Biblioteca from './pages/Biblioteca';
import CertificacionOficial from './pages/CertificacionOficial';
import Contacto from './pages/Contacto';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/Nosotros" element={<Equipo />} />
        <Route path="/Escuelas" element={<EscuelasPage />} />
        <Route path="/News" element={<BlogPage />} />
        <Route path="/rcp" element={<AprendeRCP />} />
        <Route path="/Servicios" element={<ServiciosPages />} />
        <Route path="/Biblioteca" element={<Biblioteca />} />
        <Route path="/Certificacion" element={<CertificacionOficial />} />
        <Route path="/Contacto" element={<Contacto />} />
        {/* Puedes eliminar esta ruta porque "/*" coincide con cualquier ruta, por lo que esta ruta nunca será alcanzada */}
        {/* <Route path="/*" element={<About />} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
