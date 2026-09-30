import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, BookOpen, Code2, Eye, HeartHandshake, ShieldCheck, Target } from 'lucide-react';
import practicePhoto from '../assets/photos/nosotros-practica-rcp.png';

const purpose = [
  { icon: Target, label: 'Nuestra misión', title: 'Compartir herramientas para actuar.', description: 'Capacitar en RCP, primeros auxilios, soporte vital básico y uso del DEA, acompañando a instituciones, equipos y personas en su preparación.' },
  { icon: Eye, label: 'Nuestra visión', title: 'Una comunidad más preparada.', description: 'Construir una cultura de prevención en la que el conocimiento y la práctica estén al alcance de más personas, en la escuela, el trabajo y la vida cotidiana.' },
  { icon: ShieldCheck, label: 'Nuestro objetivo', title: 'Promover el cuidado y la prevención.', description: 'Impulsar acciones de formación y prevención frente a la muerte súbita y el ahogamiento, fortaleciendo la capacidad de la comunidad para ayudar.' },
];

const team = [
  { name: 'Felipe Builes', role: 'Técnico', image: '/images/felipe-builes.jpg', quote: 'Aprender técnicas de RCP y el manejo del DEA no es solo un deber, es un llamado a la acción colectiva. Enfrentemos unidos la amenaza de la muerte súbita y el ahogamiento.' },
  { name: 'José María Nart', role: 'Licenciado y profesor', image: '/images/jose-maria-nart.jpg', quote: 'Despierta el potencial que llevas dentro; con habilidades adecuadas y conocimientos sólidos, puedes convertirte en el faro que salva vidas y enciende esperanzas.' },
];

export const Nosotros = () => (
  <div className="grcp-about">
    <section className="grcp-about-hero" aria-labelledby="about-title">
      <div className="grcp-container grcp-about-hero-grid">
        <div><p className="grcp-eyebrow">SOMOS GRCP ARGENTINA</p><h1 id="about-title">Nos une el compromiso<br />de <span>cuidar a otros.</span></h1><p>Somos el Grupo de Rescate, Capacitación y Prevención. Trabajamos para acercar conocimientos y práctica a quienes quieren estar preparados para ayudar.</p><div className="grcp-about-hero-actions"><Link to="/Servicios" className="grcp-button grcp-button-primary">Conocé las capacitaciones <ArrowRight size={18} aria-hidden="true" /></Link><a href="#equipo" className="grcp-button grcp-button-secondary">Nuestro equipo <ArrowDown size={18} aria-hidden="true" /></a></div></div>
        <figure><img src={practicePhoto} alt="Participante practicando compresiones de RCP sobre un maniquí" width="662" height="840" fetchPriority="high" /><figcaption><HeartHandshake size={20} aria-hidden="true" />El cuidado empieza con personas que eligen prepararse.</figcaption></figure>
      </div>
    </section>
    <section className="grcp-about-purpose" aria-labelledby="purpose-title"><div className="grcp-container">
      <div className="grcp-section-heading"><div><p className="grcp-eyebrow">LO QUE NOS MUEVE</p><h2 id="purpose-title">La preparación tiene<br />un propósito compartido.</h2></div><p>Promovemos la seguridad y el bienestar de la comunidad a través de la capacitación y la prevención.</p></div>
      <div className="grcp-about-purpose-grid">{purpose.map(({ icon: Icon, label, title, description }) => <article key={label}><Icon size={26} aria-hidden="true" /><p>{label}</p><h3>{title}</h3><p>{description}</p></article>)}</div>
    </div></section>
    <section id="equipo" className="grcp-about-team" aria-labelledby="team-title"><div className="grcp-container">
      <div className="grcp-section-heading"><div><p className="grcp-eyebrow">QUIÉNES SOMOS</p><h2 id="team-title">El equipo de GRCP.</h2></div><p>Personas comprometidas con la formación, la prevención y el cuidado de la comunidad.</p></div>
      <div className="grcp-about-team-grid">{team.map(member => <article key={member.name} className="grcp-team-card"><img src={member.image} alt={member.name} width="640" height="640" loading="lazy" /><div><p className="grcp-eyebrow">{member.role}</p><h3>{member.name}</h3><blockquote><p>“{member.quote}”</p></blockquote></div></article>)}</div>
    </div></section>
    <section className="grcp-about-collaboration" aria-labelledby="collaboration-title"><div className="grcp-container">
      <div className="grcp-section-heading"><div><p className="grcp-eyebrow">COLABORACIÓN</p><h2 id="collaboration-title">Tecnología al servicio<br />de la formación.</h2></div><p>Los recursos digitales también ayudan a acercar la preparación a más personas.</p></div>
      <article className="grcp-collaborator-card"><img src="/images/julian-peruzzi.png" alt="Julián Peruzzi, colaborador en desarrollo y tecnología" width="460" height="460" loading="lazy" /><div><span className="grcp-collaborator-role"><Code2 size={17} aria-hidden="true" />Desarrollo y tecnología · Colaborador</span><h3>Julián Peruzzi</h3><p>Colabora con GRCP en el desarrollo del sitio y sus recursos digitales, conectando tecnología, diseño y aprendizaje para que la información sea clara, accesible y fácil de usar.</p><p>Su aporte acompaña la misión del proyecto: acercar herramientas de preparación y prevención a la comunidad.</p><Link to="/Biblioteca">Explorá nuestros recursos <ArrowRight size={17} aria-hidden="true" /></Link></div></article>
    </div></section>
    <section className="grcp-about-principles" aria-labelledby="principles-title"><div className="grcp-container"><div><p className="grcp-eyebrow">NUESTRA FORMA DE TRABAJAR</p><h2 id="principles-title">Conocer. Practicar.<br />Compartir.</h2></div><ul><li><BookOpen size={22} aria-hidden="true" /><div><h3>Aprendizaje claro</h3><p>Contenidos que se adaptan al grupo y a su entorno.</p></div></li><li><HeartHandshake size={22} aria-hidden="true" /><div><h3>Práctica acompañada</h3><p>Espacios para aprender haciendo y trabajar en equipo.</p></div></li><li><ShieldCheck size={22} aria-hidden="true" /><div><h3>Prevención cotidiana</h3><p>Una cultura de cuidado que continúa después de la capacitación.</p></div></li></ul></div></section>
    <section className="grcp-services-contact" aria-labelledby="about-contact-title"><div className="grcp-container"><div><p className="grcp-eyebrow">SIGAMOS CONSTRUYENDO COMUNIDAD</p><h2 id="about-contact-title">Tu grupo también puede ser parte.</h2><p>Contanos sobre tu escuela, organización o equipo y conversemos sobre una propuesta de capacitación.</p></div><div className="grcp-services-contact-actions"><Link to="/Contacto" className="grcp-button grcp-button-primary">Hablemos <ArrowRight size={18} aria-hidden="true" /></Link><Link to="/Servicios" className="grcp-button grcp-button-secondary">Ver capacitaciones</Link></div></div></section>
  </div>
);
