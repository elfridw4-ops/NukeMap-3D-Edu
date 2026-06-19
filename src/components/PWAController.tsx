import { useEffect, useState } from 'react';

export const PWAController = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
          // This ensures that the user only sees the refresh prompt once
          window.location.reload();
      });
      
      // Check for updates
      navigator.serviceWorker.ready.then(registration => {
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
        <button onClick={handleInstall} className="fixed bottom-4 right-4 bg-red-600 z-50 text-white px-4 py-2 rounded shadow-lg">
          Installer l'application
        </button>
      )}
      {showUpdateToast && (
        <div className="fixed bottom-4 left-4 bg-zinc-800 z-50 text-white p-4 rounded shadow-lg">
          Une nouvelle version est disponible.
          <button onClick={handleUpdate} className="ml-2 bg-red-600 px-2 py-1 rounded">Mettre à jour</button>
        </div>
      )}
    </>
  );
};
