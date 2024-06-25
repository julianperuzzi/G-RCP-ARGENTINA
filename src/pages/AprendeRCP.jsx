import React from 'react';
import MapaDesfibriladores from '../components/MapaDesfibriladores'; // Componente del mapa de desfibriladores
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importa FontAwesomeIcon
import { faSpotify } from '@fortawesome/free-brands-svg-icons'; // Icono de Spotify
import { faHeart } from '@fortawesome/free-solid-svg-icons'; // Icono de corazón

const AprendeRCP = () => {
  return (
    <div className="container mx-auto px-4 py-4 lg:w-2/3 animate-fade-in bg-neutral-50">
      <h1 className="text-3xl font-bold mb-4">Aprende RCP</h1>
      

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">¿Por qué es importante saber hacer RCP?</h2>
        <p className="text-gray-700">
          La RCP (Reanimación Cardiopulmonar) es una técnica vital que puede salvar vidas durante emergencias cardíacas. Al realizar RCP de manera adecuada, puedes mantener la circulación de la sangre y el suministro de oxígeno al cerebro hasta que llegue ayuda médica profesional.
        </p>
        <section className='my-4'>
  <h2 className="text-xl font-bold mb-2">Cómo hacer RCP</h2>
  <div className='relative w-full' style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
    <iframe 
      src="https://www.youtube.com/embed/wbp_AdGkWPM" 
      title="¿Cómo realizar la maniobra de RCP?" 
      frameBorder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      referrerPolicy="strict-origin-when-cross-origin" 
      className='absolute top-0 left-0 w-full h-full' 
      allowFullScreen
    />
  </div>
</section>

      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Uso del DEA (Desfibrilador Externo Automático)</h2>
        <p className="text-gray-700">
          El DEA es un dispositivo portátil que puede administrar una descarga eléctrica controlada para restablecer el ritmo cardíaco normal en caso de paro cardíaco repentino. Aprender cómo usar un DEA correctamente puede mejorar significativamente las posibilidades de supervivencia durante una emergencia cardíaca.
        </p>
      </div>


      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Mapa de Desfibriladores en Argentina</h2>
        <MapaDesfibriladores />
      </div>



      <div className="mb-4">
       <h2 className="text-xl font-bold mb-2">Llamada de Emergencia</h2>
         <p className="text-gray-700 mb-4">
         Es importante conocer el número de emergencias médicas en Argentina. Si presencias una emergencia cardíaca, llama al <strong>107</strong> para recibir asistencia médica urgente.
         </p>
       <a href="tel:107" className="bg-red-600 text-white font-bold py-3 px-6 hover:bg-black my-4">
        Llamar al 107
      </a>
        </div>

      
      <div className="mb-8 flex flex-col items-center justify-center">
         <h2 className="text-xl font-bold mb-8">Ritmo RCP</h2>
         <FontAwesomeIcon icon={faHeart} className="text-red-500 heart h-32" />
        </div>


      <div>
        <h2 className="text-xl font-bold mb-2 flex items-center">Playlist Spotify RCP <FontAwesomeIcon icon={faSpotify} className="text-green-500 ml-2" /></h2>
        <iframe style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/playlist/0Zn5eFN54B1TEcgHGVxU9S?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      </div>
    </div>
  );
}

export default AprendeRCP;
