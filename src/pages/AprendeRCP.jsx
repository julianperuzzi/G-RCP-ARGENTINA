import React from 'react';
import MapaDesfibriladores from '../components/MapaDesfibriladores'; // Componente del mapa de desfibriladores
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importa FontAwesomeIcon
import { faSpotify } from '@fortawesome/free-brands-svg-icons'; // Icono de Spotify
import { faHeart } from '@fortawesome/free-solid-svg-icons'; // Icono de corazón

const AprendeRCP = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Aprende RCP</h1>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Mapa de Desfibriladores en Argentina</h2>
        <MapaDesfibriladores />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Corazón que late a 110bpm</h2>
        <FontAwesomeIcon icon={faHeart} className="text-red-500 text-4xl mb-2" />
        {/* Aquí puedes agregar la animación del corazón que late */}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">¿Por qué es importante saber hacer RCP?</h2>
        <p className="text-gray-700">
          La RCP (Reanimación Cardiopulmonar) es una técnica vital que puede salvar vidas durante emergencias cardíacas. Al realizar RCP de manera adecuada, puedes mantener la circulación de la sangre y el suministro de oxígeno al cerebro hasta que llegue ayuda médica profesional.
        </p>
        <section className='my-4'>
        <iframe width="500" height="300" src="https://www.youtube.com/embed/wbp_AdGkWPM" title="¿Cómo realizar la maniobra de RCP?" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </section>


        <iframe width="1072" height="603" src="https://www.youtube.com/embed/wbp_AdGkWPM" title="¿Cómo realizar la maniobra de RCP?" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Uso del DEA (Desfibrilador Externo Automático)</h2>
        <p className="text-gray-700">
          El DEA es un dispositivo portátil que puede administrar una descarga eléctrica controlada para restablecer el ritmo cardíaco normal en caso de paro cardíaco repentino. Aprender cómo usar un DEA correctamente puede mejorar significativamente las posibilidades de supervivencia durante una emergencia cardíaca.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2 flex items-center">Playlist de Spotify para hacer RCP <FontAwesomeIcon icon={faSpotify} className="text-green-500 ml-2" /></h2>
        <iframe style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/playlist/0Zn5eFN54B1TEcgHGVxU9S?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      </div>
    </div>
  );
}

export default AprendeRCP;
