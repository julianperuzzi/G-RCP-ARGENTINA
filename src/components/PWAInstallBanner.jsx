import { useState, useEffect } from 'react';

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setPrompt(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#0A1220] border border-[#f4623a]/40 text-white px-5 py-3 rounded-2xl shadow-2xl max-w-sm w-[calc(100%-2rem)]">
      <div className="flex-shrink-0 bg-[#f4623a] rounded-xl p-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v13M8 11l4 4 4-4" />
          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">Instalar GRCP Argentina</p>
        <p className="text-xs text-gray-400 leading-tight mt-0.5">Acceso rápido desde tu pantalla</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded transition-colors"
          aria-label="Cerrar"
        >
          ✕
        </button>
        <button
          onClick={handleInstall}
          className="bg-[#f4623a] hover:bg-[#d94e28] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
        >
          Instalar
        </button>
      </div>
    </div>
  );
}
