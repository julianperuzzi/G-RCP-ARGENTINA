import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { authLinkType } from './lib/authLink';
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
import ContactButton from './components/ContactButton';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import RCPPractice from './pages/RCPPractice';
import Galeria from './pages/Galeria';
import RA_Menu from './pages/RA_Menu';
import PWAInstallBanner from './components/PWAInstallBanner';

const MapaDEA = lazy(() => import('./pages/MapaDEA'));
const PanelDEA = lazy(() => import('./pages/PanelDEA'));
const Portal = lazy(() => import('./pages/Portal'));
const ShopPage = lazy(() => import('./pages/ShopPages'));

function SiteApp() {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const [inviteLanding, setInviteLanding] = useState(() => authLinkType === 'invite' && location.pathname === '/');
  const privatePortal = inviteLanding || /^\/(portal|gestion)(\/|$)/i.test(location.pathname);
  useEffect(() => {
    if (inviteLanding && location.pathname !== '/') setInviteLanding(false);
  }, [inviteLanding, location.pathname]);

  useEffect(() => {
    setDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
      <div className={`App ${darkMode ? 'dark' : ''}`}>
        {!privatePortal && <><Analytics /><SpeedInsights /><Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></>}
        <ScrollToTop />
        <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<p className="p-8 text-center" role="status">Cargando…</p>}>
        <Routes>
          <Route path="/" element={inviteLanding ? <Navigate to={{ pathname: '/Portal', hash: location.hash }} replace /> : <Home />} />
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
          <Route path="/PanelDEA" element={<PanelDEA />} />
          <Route path="/Portal/*" element={<Portal />} />
          <Route path="/Gestion" element={<Navigate to="/Portal" replace />} />
          <Route path="/Rcp-game" element={<RcpGame />} />
          <Route path="/Practica-rcp" element={<RCPPractice />} />
          <Route path="/RA-Menu" element={<RA_Menu />} />
          <Route path="/Galeria" element={<Galeria />} />
          <Route path="/shop" element={<ShopPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
        </main>
        {!privatePortal && <><PWAInstallBanner /><ContactButton /><Footer /></>}
      </div>
  );
}

export default function App() { return <Router><SiteApp /></Router>; }
