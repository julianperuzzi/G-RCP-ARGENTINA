import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop'; // componente para ir al copmienzo

import Header from './components/Header';
import { Footer } from './components/Footer';
import { About } from './pages/About';
import { Equipo } from './pages/Equipo';
import { EscuelasPage } from './pages/EscuelasPage';
import BlogPage from './pages/BlogPage';





function App() {
  return (
    <aside>
    <Router>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/Nosotros" element={<Equipo />} />
        <Route path="/Escuelas" element={<EscuelasPage />} />
        <Route path="/News" element={<BlogPage />} />
      </Routes>
      <Footer />
    </Router>
    </aside>
  );
}

export default App;
