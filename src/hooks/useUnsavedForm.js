import { useEffect, useRef, useState } from 'react';

export default function useUnsavedForm(value, file, busy, onClose) {
  const initial = useRef(JSON.stringify(value));
  const saved = useRef(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const dirty = !saved.current && (JSON.stringify(value) !== initial.current || Boolean(file));

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function requestClose() {
    if (busy) return;
    if (dirty) setConfirmDiscard(true);
    else onClose();
  }
  function closeAfterSave() { saved.current = true; onClose(); }
  function discard() { saved.current = true; onClose(); }
  return { requestClose, closeAfterSave, confirmDiscard, setConfirmDiscard, discard, dirty };
}
