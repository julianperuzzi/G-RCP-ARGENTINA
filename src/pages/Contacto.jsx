import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { ArrowUpRight, CheckCircle2, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import './contacto.css';

const programNames = {
  escuelas: 'instituciones educativas',
  empresas: 'empresas y organizaciones',
  deporte: 'clubes y equipos deportivos',
  comunidad: 'comunidad',
};

export default function Contacto() {
  const form = useRef(null);
  const [searchParams] = useSearchParams();
  const selectedProgram = programNames[searchParams.get('programa')];
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  async function sendEmail(event) {
    event.preventDefault();
    setEnviando(true);
    setEnviado(false);
    setError('');
    try {
      await emailjs.sendForm('service_gdyf4jl', 'template_y0xgfug', form.current, {
        publicKey: '__jb6l56CCCKzd3nK',
      });
      form.current.reset();
      setEnviado(true);
    } catch {
      setError('No pudimos enviar el mensaje. Intentá de nuevo o escribinos por WhatsApp.');
    } finally {
      setEnviando(false);
    }
  }

  return <div className="grcp-contact">
    <header className="grcp-contact-hero">
      <div className="grcp-container">
        <p className="grcp-eyebrow"><span />HABLEMOS</p>
        <h1>Estamos para <span>ayudarte.</span></h1>
        <p>Contanos qué necesitás y te ayudamos a encontrar la capacitación adecuada.</p>
      </div>
    </header>

    <div className="grcp-container grcp-contact-layout">
      <section className="grcp-contact-form-card" aria-labelledby="contact-form-title">
        <div className="grcp-contact-section-heading">
          <span className="grcp-contact-icon"><Mail size={21} aria-hidden="true" /></span>
          <div><h2 id="contact-form-title">Envianos tu consulta</h2><p>Completá el formulario y te responderemos a la brevedad.</p></div>
        </div>
        {enviado && <p className="grcp-contact-success" role="status"><CheckCircle2 size={18} />Mensaje enviado. Gracias por escribirnos.</p>}
        {error && <p className="grcp-contact-error" role="alert">{error}</p>}
        <form ref={form} onSubmit={sendEmail} className="grcp-contact-form">
          <div className="grcp-contact-form-row">
            <label>Nombre completo<input name="user_name" type="text" autoComplete="name" placeholder="Tu nombre" required maxLength={100} /></label>
            <label>Correo electrónico<input name="user_email" type="email" autoComplete="email" placeholder="nombre@correo.com" required maxLength={254} /></label>
          </div>
          <label>Teléfono (opcional)<input name="user_phone" type="tel" autoComplete="tel" placeholder="+54 9 264 123 4567" maxLength={40} /></label>
          <label>Mensaje<textarea name="message" rows={5} defaultValue={selectedProgram ? `Hola, quisiera consultar por una capacitación para ${selectedProgram}.` : ''} placeholder="Contanos en qué podemos ayudarte" required maxLength={3000} /></label>
          <button type="submit" className="grcp-button grcp-button-primary" disabled={enviando}><Send size={17} aria-hidden="true" />{enviando ? 'Enviando…' : 'Enviar consulta'}</button>
        </form>
      </section>

      <aside className="grcp-contact-aside" aria-label="Otras formas de contacto">
        <section className="grcp-contact-whatsapp">
          <span className="grcp-contact-whatsapp-icon"><MessageCircle size={24} aria-hidden="true" /></span>
          <p className="grcp-eyebrow">CONTACTO DIRECTO</p>
          <h2>¿Preferís conversar?</h2>
          <p>Escribinos por WhatsApp y contanos tu consulta.</p>
          <a href="https://wa.me/5492645667981" target="_blank" rel="noopener noreferrer" className="grcp-contact-whatsapp-link">Abrir WhatsApp <ArrowUpRight size={17} aria-hidden="true" /></a>
        </section>
        <section className="grcp-contact-details">
          <h2>También podés contactarnos</h2>
          <a href="tel:+5492645667981"><Phone size={19} aria-hidden="true" /><span><small>Teléfono</small>+54 9 264 566 7981</span><ArrowUpRight size={16} aria-hidden="true" /></a>
          <a href="mailto:gruporcpsa@gmail.com"><Mail size={19} aria-hidden="true" /><span><small>Correo electrónico</small>gruporcpsa@gmail.com</span><ArrowUpRight size={16} aria-hidden="true" /></a>
          <div><MapPin size={19} aria-hidden="true" /><span><small>Estamos en</small>San Juan, Argentina</span></div>
        </section>
      </aside>
    </div>
  </div>;
}
