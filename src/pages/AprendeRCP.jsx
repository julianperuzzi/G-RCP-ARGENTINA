import React from 'react';
import MapaDesfibriladores from '../components/MapaDesfibriladores'; // Componente del mapa de desfibriladores
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importa FontAwesomeIcon
import { faSpotify, faGoogleScholar} from '@fortawesome/free-brands-svg-icons'; // Iconos de Spotify y corazón
import AOS from 'aos';
import 'aos/dist/aos.css'; // Animaciones al hacer scroll

const AprendeRCP = () => {
  // Inicializar AOS para animaciones
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 lg:w-2/3 animate-fade-in">
      {/* Título Principal */}
      <h1
        className="text-4xl font-bold my-6 uppercase border-b-2 border-orange-600 pb-4"
        data-aos="fade-down"
      >
        Aprende RCP
      </h1>

      {/* Sección: Importancia del RCP */}
      <section className="mb-12" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FontAwesomeIcon icon={faGoogleScholar} className="text-red-600 mr-2" />
          ¿Por qué es importante saber hacer RCP?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          La RCP (Reanimación Cardiopulmonar) es una técnica vital que puede salvar vidas durante emergencias cardíacas. Al realizar RCP de manera adecuada, puedes mantener la circulación de la sangre y el suministro de oxígeno al cerebro hasta que llegue ayuda médica profesional.
        </p>
      </section>

      {/* Sección: Video de RCP */}
      <section className="mb-12" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">Cómo hacer RCP</h2>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
          <iframe
            src="https://www.youtube.com/embed/wbp_AdGkWPM"
            title="¿Cómo realizar la maniobra de RCP?"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
            allowFullScreen
          />
        </div>
      </section>

      {/* Sección: Uso del DEA */}
      <section className="mb-12" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">Uso del DEA (Desfibrilador Externo Automático)</h2>
        <p className="text-gray-700 leading-relaxed">
          El DEA es un dispositivo portátil que puede administrar una descarga eléctrica controlada para restablecer el ritmo cardíaco normal en caso de paro cardíaco repentino. Aprender cómo usar un DEA correctamente puede mejorar significativamente las posibilidades de supervivencia durante una emergencia cardíaca.
        </p>
      </section>

      {/* Sección: Mapa de Desfibriladores */}
      <section className="mb-12" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">Mapa de Desfibriladores en Argentina</h2>
        <div className="rounded-lg overflow-hidden shadow-md">
          <MapaDesfibriladores />
        </div>
      </section>

      {/* Sección: Llamada de Emergencia */}
      <section className="mb-12" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">Llamada de Emergencia</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Es importante conocer el número de emergencias médicas en Argentina. Si presencias una emergencia cardíaca, llama al <strong>107</strong> para recibir asistencia médica urgente.
        </p>
        <a
          href="tel:107"
          className="bg-red-600 text-white font-bold py-3 px-6 hover:bg-black rounded-lg shadow-md transition duration-300"
        >
          Llamar al 107
        </a>
      </section>

      {/* Sección: Playlist de Spotify */}
      <section className="my-16" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          Playlist Spotify RCP <FontAwesomeIcon icon={faSpotify} className="text-green-500 ml-2" />
        </h2>
        <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/playlist/0Zn5eFN54B1TEcgHGVxU9S?utm_source=generator"
          width="100%"
          height="352"
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="shadow-md"
        />
      </section>
    </div>
  );
};

export default AprendeRCP;