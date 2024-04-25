import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import NotFoundPage from './pages/NotFoundPage'; // Importa la página de error 404 o coming soon
import Minero from './pages/Minero';

function App() {
  return (
    <Router>
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
        <Route path="/Mineras" element={<Minero />} />
        {/* Ruta para manejar cualquier ruta no definida */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;