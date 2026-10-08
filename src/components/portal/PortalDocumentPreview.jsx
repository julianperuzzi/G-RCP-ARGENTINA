/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { Download, X } from 'lucide-react';
import './portal-document-preview.css';

export default function PortalDocumentPreview({ document: file, getBlob, onDownload, onClose }) {
  const dialog = useRef(null);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    const node = dialog.current;
    node.showModal();
    let active = true;
    let objectUrl = '';
    Promise.resolve().then(() => getBlob(file)).then((blob) => {
      if (!active) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    }).catch((failure) => { if (active) setError(failure.message || 'No se pudo abrir el archivo.'); });
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); node.close(); };
  }, [file, getBlob]);
  const mime = file.mime_type || file.demoFile?.type || '';
  return <dialog ref={dialog} className="portal-dialog portal-preview-dialog" aria-label={`Vista previa de ${file.file_name || file.title}`}
    onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <div className="portal-preview-head"><div><strong>{file.title || file.file_name}</strong><small>{file.file_name}</small></div><div><button className="portal-button" onClick={() => onDownload(file)}><Download size={16} /> Descargar</button><button className="portal-icon-button" aria-label="Cerrar vista previa" onClick={onClose}><X /></button></div></div>
    <div className="portal-preview-body">
      {error ? <p role="alert" className="portal-alert error">{error}</p> : !url ? <p role="status">Cargando vista previa…</p> :
        mime.startsWith('image/') ? <img src={url} alt={file.title || file.file_name} /> :
          mime === 'application/pdf' ? <iframe src={url} title={`Vista previa de ${file.file_name}`} /> :
            <p>Este tipo de archivo no tiene vista previa. Podés descargarlo.</p>}
    </div>
  </dialog>;
}
