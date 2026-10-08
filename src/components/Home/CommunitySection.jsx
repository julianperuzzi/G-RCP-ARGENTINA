import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CommunitySection() {
  return (
    <section className="grcp-community" aria-labelledby="community-title">
      <div className="grcp-container grcp-community-grid">
        <figure><img src="/images/capacitacion-grupal.jpg" alt="Grupo de participantes reunidos al finalizar una capacitación de GRCP, mostrando sus certificados" loading="lazy" width="1199" height="900" /><figcaption>Aprender juntos. Estar preparados para ayudar.</figcaption></figure>
        <div><p className="grcp-eyebrow">PERSONAS QUE HACEN LA DIFERENCIA</p><h2 id="community-title">Una comunidad<br />más preparada.</h2><p>Detrás de cada capacitación hay personas que eligen cuidar a otros. Compartimos conocimientos, practicamos en equipo y construimos una cultura de prevención.</p><Link to="/Nosotros" className="grcp-button grcp-button-secondary">Conocé a GRCP <ArrowRight size={18} aria-hidden="true" /></Link></div>
      </div>
    </section>
  );
}
