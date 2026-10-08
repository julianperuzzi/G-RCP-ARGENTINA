import { useState } from 'react';
import { Link2 } from 'lucide-react';

export default function CopyRecordLink() {
  const [message, setMessage] = useState('Copiar enlace');
  async function copy() {
    try { await navigator.clipboard.writeText(window.location.href); setMessage('Enlace copiado'); }
    catch { setMessage('No se pudo copiar'); }
  }
  return <button type="button" className="portal-text-button" onClick={copy}><Link2 size={15} />{message}</button>;
}
