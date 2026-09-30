import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, HeartHandshake, ShieldCheck, Users } from 'lucide-react';
import trainingPhoto from '../../assets/photos/home-rcp-infantil.png';

export const Banner = () => (
  <section className="grcp-hero" aria-labelledby="hero-title">
    <div className="grcp-container grcp-hero-grid">
      <div className="grcp-hero-copy">
        <p className="grcp-eyebrow"><span /> Rescate · Capacitación · Prevención</p>
        <h1 id="hero-title">Aprendé a actuar<br />cuando más <span>importa.</span></h1>
        <p className="grcp-hero-description">La preparación hace la diferencia. En GRCP Argentina formamos a personas y equipos en RCP, primeros auxilios y uso del DEA, con práctica y compromiso con la comunidad.</p>
        <div className="grcp-hero-actions">
          <Link to="/Contacto" className="grcp-button grcp-button-primary">Solicitar una capacitación <ArrowRight size={18} aria-hidden="true" /></Link>
          <Link to="/Biblioteca" className="grcp-button grcp-button-secondary"><BookOpen size={18} aria-hidden="true" /> Explorar recursos</Link>
        </div>
        <p className="grcp-hero-note"><Users size={16} aria-hidden="true" /> Para escuelas, empresas, equipos deportivos y comunidad.</p>
      </div>
      <figure className="grcp-hero-photo">
        <img src={trainingPhoto} alt="Instructor y participante practicando RCP infantil con un maniquí" fetchPriority="high" width="695" height="814" />
        <div className="grcp-photo-label"><span className="grcp-photo-dot" /> APRENDER HACIENDO</div>
        <figcaption><HeartHandshake size={28} aria-hidden="true" /><div><strong>Prepararse también es cuidar.</strong><span>Conocimiento que se convierte en acción.</span></div></figcaption>
      </figure>
    </div>
    <div className="grcp-container grcp-purpose-strip">
      <div><ShieldCheck aria-hidden="true" /><span><strong>Prevención</strong>Una cultura de cuidado compartido.</span></div>
      <div><HeartHandshake aria-hidden="true" /><span><strong>Práctica guiada</strong>Aprender con acompañamiento.</span></div>
      <div><Users aria-hidden="true" /><span><strong>Impacto en comunidad</strong>Más personas preparadas para ayudar.</span></div>
    </div>
  </section>
);

export default Banner;
