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

// Long Animation Frames (LoAF) API Monitoring for INP Optimization
export function initLoAFMonitoring() {
  // Check if PerformanceObserver and LoAF are supported
  if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('long-animation-frame')) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Long animation frame detected (>50ms)
        const duration = entry.duration;

        if (duration > 50) {
          // Send to Google Analytics if available
          if (typeof gtag !== 'undefined') {
            gtag('event', 'long_animation_frame', {
              event_category: 'Performance',
              event_label: 'LoAF',
              value: Math.round(duration),
              non_interaction: true,
            });
          }

          // Log to console in development
          if (import.meta.env.DEV) {
            console.warn(`[LoAF] Long animation frame detected: ${duration}ms`, entry);
          }
        }
      }
    });

    try {
      observer.observe({ type: 'long-animation-frame', buffered: true });
    } catch (err) {
      console.error('Failed to observe long-animation-frame:', err);
    }
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
  initLoAFMonitoring();
}
