import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Nosotros } from './pages/Nosotros';
import { EscuelasPage } from './pages/EscuelasPage';
import BlogPage from './pages/BlogPage';
import AprendeRCP from './pages/AprendeRCP';
import ServiciosPages from './pages/ServiciosPages';
import Biblioteca from './pages/Biblioteca';
import CertificacionOficial from './pages/CertificacionOficial';
import Contacto from './pages/Contacto';
import NotFoundPage from './pages/NotFoundPage'; // Importa la página de error 404 o coming soon
import RcpGame from './pages/RcpGame'; // El nuevo componente del juego
import Minero from './pages/Minero';
import MapaDEA from './pages/MapaDEA';
import ContactButton from './components/ContactButton';

import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"




function App() {
  return (  
    <Router>
      <Analytics/>
      <SpeedInsights/>
      <Header />
      <ScrollToTop />
      
      <Routes>
        <Route path="/rcp-game" element={<RcpGame/>} />
        <Route path="/" element={<Home />} />
        <Route path="/Nosotros" element={<Nosotros />} />
        <Route path="/Escuelas" element={<EscuelasPage />} />
        <Route path="/News" element={<BlogPage />} />
        <Route path="/rcp" element={<AprendeRCP />} />
        <Route path="/Servicios" element={<ServiciosPages />} />
        <Route path="/Biblioteca" element={<Biblioteca />} />
        <Route path="/Certificacion" element={<CertificacionOficial />} />
        <Route path="/Contacto" element={<Contacto />} />
        <Route path="/Mineras" element={<Minero />} />
        <Route path="/MapaDEA" element={<MapaDEA/>} />
        {/* Ruta para manejar cualquier ruta no definida */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ContactButton />
      <Footer />
    </Router>
  );
}

export default App;