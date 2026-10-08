import { Link } from 'react-router-dom';
import { ArrowRight, Building2, GraduationCap, Heart, Users } from 'lucide-react';

const programs = [
  { icon: GraduationCap, number: '01', title: 'Escuelas', description: 'Una cultura de prevención desde el aula. Talleres para estudiantes, docentes y equipos educativos.', detail: 'Prevención · Primeros auxilios · RCP', link: '/Escuelas' },
  { icon: Building2, number: '02', title: 'Empresas', description: 'Equipos preparados para cuidar a sus compañeros y responder ante emergencias en el trabajo.', detail: 'RCP y DEA · Brigadas · Primeros auxilios', link: '/Servicios' },
  { icon: Heart, number: '03', title: 'Deporte', description: 'Formación para entrenadores, clubes y deportistas, con foco en las emergencias del entorno deportivo.', detail: 'Prevención · DEA · Emergencias deportivas', link: '/Servicios' },
  { icon: Users, number: '04', title: 'Comunidad', description: 'Herramientas para ayudar en situaciones cotidianas. Capacitaciones abiertas, sin conocimientos previos.', detail: 'RCP · Primeros auxilios · Práctica', link: '/Servicios' },
];

export const Servicios = () => (
  <section className="grcp-programs" aria-labelledby="programs-title">
    <div className="grcp-container">
      <div className="grcp-section-heading">
        <div><p className="grcp-eyebrow">CAPACITACIONES PARA CADA ENTORNO</p><h2 id="programs-title">La preparación empieza<br />con tu equipo.</h2></div>
        <p>Cada comunidad tiene necesidades distintas. Encontrá una propuesta de formación para las personas que te rodean.</p>
      </div>
      <div className="grcp-program-grid">
        {programs.map(({ icon: Icon, ...program }) => (
          <Link key={program.number} to={program.link} className="grcp-program-card">
            <div className="grcp-card-top"><Icon size={26} aria-hidden="true" /><span>{program.number}</span></div>
            <h3>{program.title}</h3><p>{program.description}</p>
            <span className="grcp-program-detail">{program.detail}</span>
            <span className="grcp-card-link">Conocer la propuesta <ArrowRight size={18} aria-hidden="true" /></span>
          </Link>
        ))}
      </div>
      <div className="grcp-program-help"><p><strong>¿Qué capacitación necesita tu institución?</strong> Contanos sobre tu grupo y armemos una propuesta.</p><Link to="/Contacto">Hablemos <ArrowRight size={17} aria-hidden="true" /></Link></div>
    </div>
  </section>
);
