import { Link } from 'react-router-dom';
import { ArrowUpRight, Instagram, Mail, MessageCircle, Phone } from 'lucide-react';
import logo from '../assets/logos/logo g.rcp sin letras.svg';
import './footer.css';

export function Footer() {
  return <footer id="site-footer" className="grcp-footer">
    <div className="grcp-container grcp-footer-main">
      <div className="grcp-footer-about">
        <Link to="/" className="grcp-footer-brand" aria-label="GRCP Argentina, inicio"><img src={logo} alt="" /><span><strong>GRCP ARGENTINA</strong><small>Preparación para cuidar.</small></span></Link>
        <p>Capacitación para actuar con confianza cuando más importa.</p>
      </div>
      <nav className="grcp-footer-links" aria-label="Enlaces del pie de página">
        <h2>Explorá</h2>
        <Link to="/Servicios">Capacitaciones</Link>
        <Link to="/MapaDEA">Mapa DEA</Link>
        <Link to="/rcp">Aprendé RCP</Link>
        <Link to="/Nosotros">Nosotros</Link>
      </nav>
      <div className="grcp-footer-contact">
        <h2>Hablemos</h2>
        <Link to="/Contacto">Ir a contacto <ArrowUpRight size={15} aria-hidden="true" /></Link>
        <a href="mailto:gruporcpsa@gmail.com"><Mail size={16} aria-hidden="true" />gruporcpsa@gmail.com</a>
        <a href="tel:+5492645667981"><Phone size={16} aria-hidden="true" />+54 9 264 566 7981</a>
      </div>
      <div className="grcp-footer-social">
        <h2>Seguinos</h2>
        <a href="https://www.instagram.com/grcp_arg/" target="_blank" rel="noopener noreferrer"><Instagram size={18} aria-hidden="true" />Instagram</a>
        <a href="https://wa.me/5492645667981" target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" />WhatsApp</a>
      </div>
    </div>
    <div className="grcp-container grcp-footer-bottom">
      <span>© {new Date().getFullYear()} GRCP Argentina</span>
      <span>Desarrollo <a href="https://www.linkedin.com/in/julianperuzzi/" target="_blank" rel="noopener noreferrer">Julian Peruzzi</a></span>
    </div>
  </footer>;
}
