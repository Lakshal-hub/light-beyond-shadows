// PWA Setup - Register Service Worker and Handle Installation
(function() {
  'use strict';

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered successfully:', registration);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every 60 seconds

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateNotification();
              }
            });
          });
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    });

    // Handle controller change (app update)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed');
    });
  }

  // Handle install prompt for Android/Web
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPrompt();
  });

  function showInstallPrompt() {
    const installBanner = document.getElementById('install-banner');
    if (!installBanner) return;

    installBanner.style.display = 'flex';
    
    const installBtn = document.getElementById('install-btn');
    const dismissBtn = document.getElementById('dismiss-btn');

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User response to the install prompt: ${outcome}`);
          deferredPrompt = null;
          if (installBanner) {
            installBanner.style.display = 'none';
          }
        }
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        if (installBanner) {
          installBanner.style.display = 'none';
        }
        deferredPrompt = null;
      });
    }
  }

  // App installed handler
  window.addEventListener('appinstalled', () => {
    console.log('App installed successfully');
    deferredPrompt = null;
  });

  // Show update notification
  function showUpdateNotification() {
    const updateBanner = document.getElementById('update-banner');
    if (updateBanner) {
      updateBanner.style.display = 'flex';
      
      const updateBtn = document.getElementById('update-btn');
      if (updateBtn) {
        updateBtn.addEventListener('click', () => {
          navigator.serviceWorker.ready.then(registration => {
            registration.installing.postMessage({ type: 'SKIP_WAITING' });
          });
          window.location.reload();
        });
      }
    }
  }

  // Check if app is running standalone (installed)
  function checkIfStandalone() {
    if (window.navigator.standalone === true) {
      document.body.classList.add('standalone-mode');
      console.log('App running in standalone mode');
    }
  }

  checkIfStandalone();

  // Handle display mode changes
  if (window.matchMedia('(display-mode: standalone)').matches) {
    document.body.classList.add('app-mode');
  }

  window.matchMedia('(display-mode: standalone)').addListener(e => {
    if (e.matches) {
      document.body.classList.add('app-mode');
    }
  });
})();
