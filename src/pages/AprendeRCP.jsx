import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, HeartPulse, MapPin, Phone, PlayCircle, Radio, ShieldCheck } from 'lucide-react';
import './aprende-rcp.css';

const steps = [
  { number: '01', title: 'Observá y comprobá', text: 'Asegurate de que el lugar sea seguro. Si la persona no responde y no respira normalmente o solo jadea, actuá de inmediato.', icon: ShieldCheck },
  { number: '02', title: 'Pedí ayuda', text: 'Llamá al servicio de emergencias o pedile a otra persona que llame y busque un DEA si hay uno cerca.', icon: Phone },
  { number: '03', title: 'Comenzá las compresiones', text: 'En adultos, presioná fuerte y rápido en el centro del pecho, a un ritmo de 100 a 120 compresiones por minuto.', icon: HeartPulse },
  { number: '04', title: 'Usá el DEA', text: 'Encendelo y seguí sus indicaciones de voz. Continuá con la RCP hasta que llegue el equipo de emergencias o la persona reaccione.', icon: Radio },
];

export default function AprendeRCP() {
  return <div className="grcp-rcp">
    <header className="grcp-rcp-hero">
      <div className="grcp-container grcp-rcp-hero-grid">
        <div>
          <p className="grcp-eyebrow"><span />GUÍA BÁSICA PARA ADULTOS</p>
          <h1>Aprendé RCP.<br /><span>Preparate para actuar.</span></h1>
          <p>Reconocer un paro cardíaco, pedir ayuda y comenzar las compresiones puede marcar la diferencia mientras llega el equipo de emergencias.</p>
          <a href="#pasos-rcp" className="grcp-button grcp-button-primary">Ver los pasos <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
        <aside className="grcp-rcp-emergency" aria-label="Qué hacer ante una emergencia">
          <span><Phone size={23} aria-hidden="true" /></span>
          <p>ANTE UNA EMERGENCIA REAL</p>
          <h2>Pedí ayuda ahora.</h2>
          <p>En Argentina, llamá al <strong>911</strong> o al número de emergencias médicas de tu localidad. El <strong>107</strong> funciona según la jurisdicción.</p>
          <a href="tel:911">Llamar al 911 <ArrowUpRight size={17} aria-hidden="true" /></a>
        </aside>
      </div>
    </header>

    <section id="pasos-rcp" className="grcp-rcp-steps" aria-labelledby="rcp-steps-title">
      <div className="grcp-container">
        <div className="grcp-section-heading"><div><p className="grcp-eyebrow">CUANDO CADA SEGUNDO CUENTA</p><h2 id="rcp-steps-title">Cuatro acciones para recordar.</h2></div><p>Esta orientación resume la respuesta inicial ante un posible paro cardíaco en una persona adulta.</p></div>
        <ol className="grcp-rcp-step-grid">{steps.map(({ number, title, text, icon: Icon }) => <li key={number}><div className="grcp-rcp-step-top"><Icon size={24} aria-hidden="true" /><span>{number}</span></div><h3>{title}</h3><p>{text}</p></li>)}</ol>
        <p className="grcp-rcp-guidance">Si hay otra persona, pedile que llame a emergencias y traiga un DEA mientras comenzás las compresiones. Seguí las indicaciones del operador y del dispositivo.</p>
      </div>
    </section>

    <section className="grcp-rcp-video-section" aria-labelledby="rcp-video-title"><div className="grcp-container grcp-rcp-video-grid">
      <div><p className="grcp-eyebrow">MIRÁ LA TÉCNICA</p><h2 id="rcp-video-title">Aprender también es observar.</h2><p>Este video del Ministerio de Salud muestra cómo actuar ante una situación que requiere RCP. Después, practicá con acompañamiento para ganar confianza.</p><Link to="/Servicios" className="grcp-rcp-text-link">Conocer las capacitaciones <ArrowRight size={17} aria-hidden="true" /></Link></div>
      <div className="grcp-rcp-video"><iframe src="https://www.youtube.com/embed/wbp_AdGkWPM" title="Video del Ministerio de Salud: cómo realizar RCP" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
    </div></section>

    <section className="grcp-rcp-more" aria-labelledby="rcp-more-title"><div className="grcp-container">
      <div className="grcp-section-heading"><div><p className="grcp-eyebrow">SEGUÍ PREPARÁNDOTE</p><h2 id="rcp-more-title">Recursos para dar el siguiente paso.</h2></div></div>
      <div className="grcp-rcp-resource-grid">
        <Link to="/MapaDEA"><MapPin size={25} aria-hidden="true" /><h3>Encontrá un DEA</h3><p>Consultá las ubicaciones registradas y cómo llegar.</p><span>Abrir mapa <ArrowRight size={16} aria-hidden="true" /></span></Link>
        <Link to="/Practica-rcp"><PlayCircle size={25} aria-hidden="true" /><h3>Practicá el ritmo</h3><p>Usá el recurso interactivo para familiarizarte con la cadencia.</p><span>Ir a la práctica <ArrowRight size={16} aria-hidden="true" /></span></Link>
        <Link to="/Biblioteca"><BookOpen size={25} aria-hidden="true" /><h3>Consultá la biblioteca</h3><p>Encontrá más materiales de RCP y primeros auxilios.</p><span>Explorar recursos <ArrowRight size={16} aria-hidden="true" /></span></Link>
      </div>
      <p className="grcp-rcp-sources">Guía breve para adultos. La formación práctica y las indicaciones del servicio de emergencias son fundamentales. Fuentes: <a href="https://www.argentina.gob.ar/node/7664" target="_blank" rel="noopener noreferrer">Ministerio de Salud de Argentina</a> y <a href="https://www.heart.org/en/health-topics/cardiac-arrest/emergency-treatment-of-cardiac-arrest" target="_blank" rel="noopener noreferrer">American Heart Association</a>.</p>
    </div></section>
  </div>;
}
