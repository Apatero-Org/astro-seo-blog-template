// Service Worker Registration with Web Vitals Monitoring

// Register Service Worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available, show update prompt
                  if (confirm('New version available! Reload to update?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });
    });
  }
}

// Web Vitals Monitoring - Send to Google Analytics
export function initWebVitals() {
  // Dynamically import web-vitals to avoid increasing initial bundle
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
    const sendToAnalytics = ({ name, value, id }: { name: string; value: number; id: string }) => {
      // Send to Google Analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', name, {
          event_category: 'Web Vitals',
          event_label: id,
          value: Math.round(name === 'CLS' ? value * 1000 : value),
          non_interaction: true,
        });
      }

      // Log to console in development
      if (import.meta.env.DEV) {
        console.log(`[Web Vitals] ${name}:`, value, id);
      }
    };

    // Monitor all Core Web Vitals
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
  }).catch((err) => {
    console.error('Failed to load web-vitals:', err);
  });
}

// Initialize everything
if (typeof window !== 'undefined') {
  registerServiceWorker();
  initWebVitals();
}
