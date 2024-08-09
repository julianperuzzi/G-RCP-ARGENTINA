import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
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
import NotFoundPage from './pages/NotFoundPage';
import RcpGame from './pages/RcpGame';
import Minero from './pages/Minero';
import MapaDEA from './pages/MapaDEA';
import ContactButton from './components/ContactButton';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import RCPPractice from './pages/RCPPractice';
import Galeria from './pages/Galeria';
import RealidadAumentada from './pages/RealidadAumentada';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={`App ${darkMode ? 'dark' : ''}`}>
        <Analytics />
        <SpeedInsights />
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <ScrollToTop />
        <Routes>
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
          <Route path="/MapaDEA" element={<MapaDEA />} />
          <Route path="/rcp-game" element={<RcpGame />} />
          <Route path="/practica-rcp" element={<RCPPractice />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/ra" element={<RealidadAumentada />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ContactButton />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
