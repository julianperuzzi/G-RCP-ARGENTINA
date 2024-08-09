// // src/pages/RealidadAumentada.jsx
// import React, { useEffect } from 'react';

// const RealidadAumentada = () => {
//   useEffect(() => {
//     const loadScript = (src) => {
//       return new Promise((resolve, reject) => {
//         const script = document.createElement('script');
//         script.src = src;
//         script.async = true;
//         script.onload = resolve;
//         script.onerror = reject;
//         document.body.appendChild(script);
//       });
//     };

//     const loadScripts = async () => {
//       try {
//         // Cargar A-Frame primero
//         await loadScript('https://aframe.io/releases/1.0.4/aframe.min.js');

//         // Cargar scripts adicionales
//         await loadScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js');
//         await loadScript('https://raw.githack.com/AR-js-org/studio-backend/master/src/modules/marker/tools/gesture-detector.js');
//         await loadScript('https://raw.githack.com/AR-js-org/studio-backend/master/src/modules/marker/tools/gesture-handler.js');
//       } catch (error) {
//         console.error('Error loading scripts:', error);
//       }
//     };

//     loadScripts();

//     // Limpiar los scripts al desmontar el componente
//     return () => {
//       const scripts = document.querySelectorAll('script[src*="aframe"], script[src*="ar.js"], script[src*="gesture-"]');
//       scripts.forEach((script) => document.body.removeChild(script));
//     };
//   }, []);

//   return (
//     <div style={{ margin: 0, overflow: 'hidden', height: '100vh', width: '100vw' }}>
//       <a-scene
//         vr-mode-ui="enabled: false;"
//         loading-screen="enabled: false;"
//         arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
//         embedded
//         gesture-detector
//       >
//         <a-marker
//           id="animated-marker"
//           type="pattern"
//           preset="custom"
//           url="../assets/marker.patt"  
//           raycaster="objects: .clickable"
//           emitevents="true"
//           cursor="fuse: false; rayOrigin: mouse;"
//         >
//           <a-image
//             src="../assets/asset.png"  
//             scale="1 1 1"
//             class="clickable"
//             rotation="-90 0 0"
//             gesture-handler
//           ></a-image>
//         </a-marker>

//         <a-entity camera></a-entity>
//       </a-scene>
//     </div>
//   );
// };

// export default RealidadAumentada;
