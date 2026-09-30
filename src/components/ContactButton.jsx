import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export default function ContactButton() {
  const { pathname } = useLocation();
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) return undefined;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);

  if (pathname.toLowerCase() === '/contacto' || footerVisible) return null;

  return <a
    href="https://wa.me/5492645667981"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Escribir a GRCP por WhatsApp"
    className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition duration-300 ease-in-out z-20"
  ><FontAwesomeIcon icon={faWhatsapp} size="xl" /></a>;
}
