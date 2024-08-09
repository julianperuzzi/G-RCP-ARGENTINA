// RealidadAumentada.jsx
import React, { useEffect } from 'react';

const RealidadAumentada = () => {
  useEffect(() => {
    // Cargar scripts necesarios
    const aframeScript = document.createElement('script');
    aframeScript.src = 'https://aframe.io/releases/1.0.4/aframe.min.js';
    aframeScript.async = true;
    document.body.appendChild(aframeScript);

    const arjsScript = document.createElement('script');
    arjsScript.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';
    arjsScript.async = true;
    document.body.appendChild(arjsScript);

    const gestureDetectorScript = document.createElement('script');
    gestureDetectorScript.src = 'https://raw.githack.com/AR-js-org/studio-backend/master/src/modules/marker/tools/gesture-detector.js';
    gestureDetectorScript.async = true;
    document.body.appendChild(gestureDetectorScript);

    const gestureHandlerScript = document.createElement('script');
    gestureHandlerScript.src = 'https://raw.githack.com/AR-js-org/studio-backend/master/src/modules/marker/tools/gesture-handler.js';
    gestureHandlerScript.async = true;
    document.body.appendChild(gestureHandlerScript);

    return () => {
      // Limpiar los scripts al desmontar el componente
      document.body.removeChild(aframeScript);
      document.body.removeChild(arjsScript);
      document.body.removeChild(gestureDetectorScript);
      document.body.removeChild(gestureHandlerScript);
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
