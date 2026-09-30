import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import logo from '../assets/logos/logo g.rcp sin letras.svg';

const resources = [
  ['/rcp', 'Aprendé RCP'], ['/Biblioteca', 'Biblioteca'], ['/MapaDEA', 'Mapa de DEA'],
  ['/Practica-rcp', 'Practicá el ritmo'], ['/Rcp-game', 'Juego RCP'], ['/RA-Menu', 'Realidad aumentada'], ['/Galeria', 'Galería'],
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);
  const menuButtonRef = useRef(null);
  const resourcesButtonRef = useRef(null);

  useEffect(() => { setIsOpen(false); setIsResourcesOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!isOpen) return;
    const mobileQuery = window.matchMedia('(max-width: 1024px)');
    const previousOverflow = document.body.style.overflow;
    if (mobileQuery.matches) document.body.style.overflow = 'hidden';
    const resetOnDesktop = () => { if (!mobileQuery.matches) setIsOpen(false); };
    mobileQuery.addEventListener('change', resetOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      mobileQuery.removeEventListener('change', resetOnDesktop);
    };
  }, [isOpen]);
  useEffect(() => {
    const dismiss = (event) => {
      if (!navRef.current?.contains(event.target)) setIsResourcesOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);

  const closeMenus = (event) => {
    if (event.key === 'Tab' && isOpen && window.matchMedia('(max-width: 1024px)').matches) {
      const controls = [...navRef.current.querySelectorAll('a, button')].filter(element => element.getClientRects().length && !element.classList.contains('grcp-menu-backdrop') && !element.classList.contains('grcp-skip-link'));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    if (event.key === 'Escape') {
      if (isResourcesOpen) { setIsResourcesOpen(false); resourcesButtonRef.current?.focus(); }
      else if (isOpen) { setIsOpen(false); menuButtonRef.current?.focus(); }
    }
  };

  return (
    <header className="grcp-header" ref={navRef} onKeyDown={closeMenus}>
      <a href="#main-content" className="grcp-skip-link">Ir al contenido</a>
      {isOpen && <button className="grcp-menu-backdrop" aria-label="Cerrar menú de navegación" tabIndex={-1} onClick={() => { setIsOpen(false); setIsResourcesOpen(false); menuButtonRef.current?.focus(); }} />}
      <div className="grcp-container grcp-nav-bar">
        <Link to="/" className="grcp-brand" aria-label="GRCP Argentina, inicio"><img src={logo} alt="" width="42" height="42" /><span><strong>GRCP <span>ARGENTINA</span></strong><small>Preparación para cuidar.</small></span></Link>
        <button ref={menuButtonRef} className="grcp-menu-toggle" aria-label={isOpen ? 'Cerrar navegación' : 'Abrir navegación'} aria-expanded={isOpen} aria-controls="main-navigation" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
        <nav id="main-navigation" className={`grcp-navigation ${isOpen ? 'is-open' : ''}`} aria-label="Navegación principal">
          <NavLink to="/" end className="grcp-nav-link">Inicio</NavLink>
          <NavLink to="/Servicios" className="grcp-nav-link">Capacitaciones</NavLink>
          <div className="grcp-resources-menu" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsResourcesOpen(false); }}>
            <button ref={resourcesButtonRef} className="grcp-nav-link" aria-expanded={isResourcesOpen} aria-controls="resource-navigation" onClick={() => setIsResourcesOpen(!isResourcesOpen)}>Recursos <ChevronDown size={15} aria-hidden="true" className={isResourcesOpen ? 'is-rotated' : ''} /></button>
            {isResourcesOpen && <div id="resource-navigation" className="grcp-resource-dropdown">{resources.map(([path, label]) => <Link key={path} to={path} onClick={() => { setIsOpen(false); setIsResourcesOpen(false); }}>{label}</Link>)}</div>}
          </div>
          <NavLink to="/Nosotros" className="grcp-nav-link">Nosotros</NavLink>
          <NavLink to="/MapaDEA" className="grcp-nav-link grcp-map-link">Mapa DEA</NavLink>
          <Link to="/Contacto" className="grcp-button grcp-button-primary grcp-nav-cta">Contactanos <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
