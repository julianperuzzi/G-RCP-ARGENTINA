import React, { useEffect } from 'react';

const RealidadAumentada = () => {
  useEffect(() => {
    // Crear y cargar los scripts en orden correcto
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    // Cargar A-Frame primero
    loadScript('https://aframe.io/releases/1.0.4/aframe.min.js')
      .then(() => {
        // Luego cargar AR.js y scripts de gestos
        return Promise.all([
          loadScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js'),
          loadScript('https://raw.githack.com/AR-js-org/studio-backend/master/src/modules/marker/tools/gesture-detector.js'),
          loadScript('https://raw.githack.com/AR-js-org/studio-backend/master/src/modules/marker/tools/gesture-handler.js')
        ]);
      })
      .then(() => {
        console.log('All scripts loaded successfully');
      })
      .catch((error) => {
        console.error('Error loading scripts:', error);
      });

    // Limpiar los scripts al desmontar el componente
    return () => {
      const scripts = document.querySelectorAll('script[src*="aframe"], script[src*="githack"]');
      scripts.forEach(script => {
        document.head.removeChild(script);
      });
    };
  }, []);

  return (
    <div style={{ margin: 0, overflow: 'hidden', height: '100vh', width: '100vw' }}>
      <a-scene
        vr-mode-ui="enabled: false;"
        loading-screen="enabled: false;"
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
        id="scene"
        embedded
        gesture-detector
      >
        <a-marker
          id="animated-marker"
          type="pattern"
          preset="custom"
          url="/assets/realidadAumentada/marker.patt"
          raycaster="objects: .clickable"
          emitevents="true"
          cursor="fuse: false; rayOrigin: mouse;"
        >
          <a-image
            src="/assets/realidadAumentada/asset.png"
            scale="1 1 1"
            class="clickable"
            rotation="-90 0 0"
            gesture-handler
          ></a-image>
        </a-marker>

        <a-entity camera></a-entity>
      </a-scene>
    </div>
  );
};

export default RealidadAumentada;
