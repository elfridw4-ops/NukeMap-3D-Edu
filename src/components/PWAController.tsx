import { useEffect, useState } from 'react';
import { Download, RefreshCw, X } from 'lucide-react';

export const PWAController = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleControllerChange = () => {
      window.location.reload();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdateToast(true);
              }
            });
          }
        });
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      }
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    }
  };

  const handleUpdate = () => {
    navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });
    setShowUpdateToast(false);
  };

  return (
    <>
      {showInstallButton && (
        <div
          role="region"
          aria-label="Installation de l'application"
          className="fixed top-16 left-3 md:top-auto md:left-auto md:bottom-4 md:right-4 z-[95] bg-zinc-950/95 border border-zinc-700 text-zinc-100 px-3 py-2 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-md"
        >
          <button
            type="button"
            onClick={handleInstall}
            aria-label="Installer NUKEMAP EDU"
            className="min-h-10 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Installer
          </button>
          <button
            type="button"
            onClick={() => setShowInstallButton(false)}
            aria-label="Ignorer l'installation"
            className="min-h-10 min-w-10 flex items-center justify-center text-zinc-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {showUpdateToast && (
        <div
          role="status"
          className="fixed top-16 right-3 md:top-auto md:bottom-4 md:left-4 z-[95] bg-zinc-900/95 border border-zinc-700 text-zinc-100 p-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs backdrop-blur-md"
        >
          <span>Mise à jour disponible.</span>
          <button
            type="button"
            onClick={handleUpdate}
            className="min-h-10 bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg font-mono font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Mettre à jour
          </button>
          <button
            type="button"
            onClick={() => setShowUpdateToast(false)}
            aria-label="Fermer la notification de mise à jour"
            className="min-h-10 min-w-10 flex items-center justify-center text-zinc-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};
