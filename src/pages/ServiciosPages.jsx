import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Building2, Check, GraduationCap, Heart, MessageCircle, Users } from 'lucide-react';

const programs = [
  {
    id: 'escuelas', number: '01', icon: GraduationCap, title: 'Instituciones educativas', subtitle: 'La prevención también se aprende.',
    audience: 'Estudiantes, docentes y equipos educativos',
    description: 'Talleres para incorporar herramientas de cuidado en la escuela y el hogar, con propuestas adaptadas a cada etapa educativa.',
    topics: ['Prevención de accidentes y primeros auxilios', 'Introducción y práctica de RCP', 'Comunicación ante emergencias', 'Organización de brigadas escolares'],
    detail: 'Trabajamos con estudiantes de nivel inicial, primario y secundario, docentes y personal de la institución. La propuesta se adapta a la edad y al rol de cada grupo.',
    extraLink: '/Escuelas', extraLabel: 'Ver talleres para escuelas',
  },
  {
    id: 'empresas', number: '02', icon: Building2, title: 'Empresas y organizaciones', subtitle: 'Cuidar al equipo es parte del trabajo.',
    audience: 'Personal, responsables y brigadas de emergencia',
    description: 'Formación para fortalecer la preparación de los equipos ante emergencias y promover la prevención en el entorno laboral.',
    topics: ['RCP y uso del DEA', 'Primeros auxilios en el trabajo', 'Formación de brigadas de emergencia', 'Planes de evacuación y práctica en equipo'],
    detail: 'Definimos los contenidos según la actividad, el entorno y las necesidades de la organización. Consultá por una propuesta para tu personal o brigada.',
  },
  {
    id: 'deporte', number: '03', icon: Heart, title: 'Clubes y equipos deportivos', subtitle: 'Preparados dentro y fuera de la cancha.',
    audience: 'Entrenadores, deportistas y personal de clubes',
    description: 'Capacitación orientada a reconocer emergencias y organizar la respuesta en entrenamientos, competencias y espacios deportivos.',
    topics: ['RCP y uso del DEA en el entorno deportivo', 'Primeros auxilios y lesiones deportivas', 'Prevención y reconocimiento de emergencias', 'Organización de la respuesta del equipo'],
    detail: 'Adaptamos la formación a las características del grupo y del espacio deportivo. La práctica acompaña los contenidos para trabajar la respuesta en equipo.',
  },
  {
    id: 'comunidad', number: '04', icon: Users, title: 'Comunidad', subtitle: 'Todos podemos aprender a ayudar.',
    audience: 'Personas y grupos sin conocimientos previos',
    description: 'Capacitaciones para sumar herramientas de primeros auxilios y prevención que pueden ser útiles en la vida cotidiana.',
    topics: ['Introducción y práctica de RCP', 'Primeros auxilios y uso del DEA', 'Reconocimiento de situaciones de emergencia', 'Prevención en el hogar y la comunidad'],
    detail: 'No necesitás formación previa. Consultá por talleres abiertos o por una capacitación para tu grupo, con contenidos y práctica guiada.',
  },
];

export default function ServiciosPages() {
  return (
    <div className="grcp-services">
      <section className="grcp-services-hero" aria-labelledby="services-title">
        <div className="grcp-container grcp-services-hero-grid">
          <div><p className="grcp-eyebrow">NUESTRAS CAPACITACIONES</p><h1 id="services-title">Preparar a tu equipo<br />es una forma de <span>cuidarlo.</span></h1><p>RCP, primeros auxilios y prevención para cada entorno. Elegí una propuesta y conversemos sobre lo que necesita tu grupo.</p><a href="#programas" className="grcp-button grcp-button-primary">Encontrá tu capacitación <ArrowDown size={18} aria-hidden="true" /></a></div>
          <figure><img src="/images/capacitacion-grupal.jpg" alt="Participantes de una capacitación de GRCP reunidos con sus certificados" width="1199" height="900" fetchPriority="high" /><figcaption>La preparación se multiplica cuando aprendemos juntos.</figcaption></figure>
        </div>
      </section>
      <section id="programas" className="grcp-services-programs" aria-labelledby="services-programs-title">
        <div className="grcp-container">
          <div className="grcp-section-heading"><div><p className="grcp-eyebrow">UNA PROPUESTA PARA CADA GRUPO</p><h2 id="services-programs-title">¿A quién querés capacitar?</h2></div><p>Explorá los contenidos de cada programa. La modalidad, duración y certificación se consultan al coordinar la propuesta.</p></div>
          <nav className="grcp-service-shortcuts" aria-label="Elegir público de la capacitación">{programs.map(({ id, title, icon: Icon }) => <a key={id} href={`#${id}`}><Icon size={18} aria-hidden="true" />{title}<ArrowDown size={14} aria-hidden="true" /></a>)}</nav>
          <div className="grcp-service-grid">
            {programs.map(({ icon: Icon, ...program }) => (
              <article key={program.id} id={program.id} className="grcp-service-card" aria-labelledby={`${program.id}-title`}>
                <div className="grcp-card-top"><span className="grcp-service-icon"><Icon size={25} aria-hidden="true" /></span><span>PROGRAMA {program.number}</span></div>
                <p className="grcp-service-subtitle">{program.subtitle}</p><h3 id={`${program.id}-title`}>{program.title}</h3>
                <p className="grcp-service-audience"><Users size={15} aria-hidden="true" />{program.audience}</p>
                <p className="grcp-service-description">{program.description}</p>
                <h4>Qué trabajamos</h4><ul>{program.topics.map(topic => <li key={topic}><Check size={16} aria-hidden="true" />{topic}</li>)}</ul>
                <details><summary>Cómo se adapta a tu grupo</summary><p>{program.detail}</p>{program.extraLink && <Link to={program.extraLink}>{program.extraLabel} <ArrowRight size={15} aria-hidden="true" /></Link>}</details>
                <Link to={`/Contacto?programa=${program.id}`} className="grcp-service-consult">Consultar por este programa <ArrowRight size={18} aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="grcp-training-process" aria-labelledby="process-title"><div className="grcp-container"><p className="grcp-eyebrow">ARMEMOS LA PROPUESTA JUNTOS</p><h2 id="process-title">De la consulta a la capacitación.</h2><ol><li><span>01</span><div><h3>Contanos sobre tu grupo</h3><p>Quiénes participan, dónde están y qué necesitan aprender.</p></div></li><li><span>02</span><div><h3>Definimos la propuesta</h3><p>Coordinamos contenidos, modalidad, duración y disponibilidad.</p></div></li><li><span>03</span><div><h3>Aprendemos y practicamos</h3><p>Trabajamos los conocimientos con práctica y acompañamiento.</p></div></li></ol></div></section>
      <section className="grcp-services-contact" aria-labelledby="services-contact-title"><div className="grcp-container"><div><p className="grcp-eyebrow">EL PRIMER PASO ES CONVERSAR</p><h2 id="services-contact-title">Empecemos por tu equipo.</h2><p>Si todavía no sabés qué programa elegir, contanos qué necesitás y te orientamos.</p></div><div className="grcp-services-contact-actions"><Link to="/Contacto" className="grcp-button grcp-button-primary">Solicitar una propuesta <ArrowRight size={18} aria-hidden="true" /></Link><a href="https://wa.me/5492645667981" target="_blank" rel="noopener noreferrer" className="grcp-button grcp-button-secondary"><MessageCircle size={18} aria-hidden="true" />Consultar por WhatsApp</a></div></div></section>
    </div>
  );
}
