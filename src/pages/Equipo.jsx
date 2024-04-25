import React, { useState } from 'react';
import img3 from '../assets/perfil equipo/julian perfil.png';
import img2 from '../assets//perfil equipo/feli perfil.jpeg';
import img1 from '../assets//perfil equipo/jisu perfil.jpeg';
import empresaLogo from '../assets/logo white g rcp.pptx.svg';
import otroLogo from '../assets/lodo dark g rcp.pptx.svg';
import { Link } from 'react-router-dom';


export const Equipo = () => {
  const [mostrarMiembros, setMostrarMiembros] = useState(false);

  return (
    <aside className="px-4 py-6 bg-gray-900 text-white">
      <div className='xl:w-2/3 xl:mx-auto' >
        <img src={otroLogo} alt="Otro logo de la empresa" className="mx-auto mb-4" style={{ maxWidth: '300px' }} />
        <div className="flex items-center justify-center bg-gray-100 p-4 mb-4 mx-auto sm:mx-40">
          <img src={empresaLogo} alt="Logo de la empresa" className="w-24 h-24 mr-4" />
          <div>
            <h2 className="text-4xl font-bold mb-2 text-AzulOscuro">Nosotros</h2>
            <p className='text-AzulOscuro text-l'>Somos una empresa comprometida con la seguridad y el bienestar de la comunidad.</p>
          </div>
        </div>

        <div className="mt-4 mx-10 text-[14px] sm:mx-40 md:text-[16px] text-justify">
          <h2 className="font-bold pt-4 text-xl pb-2">Misión:</h2>
          <p className="text-l">Nuestra misión es capacitar a instituciones educativas y empresas en técnicas de reanimación cardiopulmonar (RCP), primeros auxilios, soporte vital básico y manejo de desfibriladores externos automáticos (DEA). Nos comprometemos a brindar conocimientos actualizados y prácticos que permitan a los participantes responder de manera efectiva ante emergencias médicas, salvaguardando vidas y promoviendo entornos seguros y preparados para actuar en situaciones críticas.</p>
          <h2 className="font-bold mt-4 border-t-2 pt-4 pb-2 text-xl">Visión:</h2>
          <p className="text-l">Nos visualizamos como líderes en la capacitación en RCP, primeros auxilios, soporte vital básico y manejo de DEA para instituciones educativas y empresas.Aspiramos a ser reconocidos por nuestra calidad en la formación, contribuyendo a la creación de una sociedad más preparada y comprometida con la seguridad y el bienestar de sus miembros. Nuestra visión es un futuro donde todos los centros educativos y empresas cuenten con personal capacitado para responder eficazmente ante emergencias médicas, reduciendo así el riesgo de lesiones graves y salvando vidas.</p>
          <h2 className="font-bold mt-4 border-t-2 pt-4 text-xl pb-2">Objetivo:</h2>
          <p className="text-l">Buscamos ser participes y generadores de acciones preventivas para la comunidad en general para acabar (o al menos disminuir) las epidemias de las que poco se habla: EL AHOGAMIENTO Y LA MUERTE SÚBITA.</p>
        </div>
      </div>

      <div className="flex text-center justify-center ">
        <h2 className="text-3xl font-bold mb-3 mt-6 xl:mt-32">Nuestro Equipo</h2>
      </div>

      {mostrarMiembros && (
        <div className="flex flex-wrap justify-center gap-8 lg:w-2/3 lg:mx-auto">
          {/* Aquí van los miembros del equipo */}
          <figure className="md:flex bg-gray-100 rounded-xl p-8 md:p-0 w-full shadow-lg">
            <img
              className="w-24 h-24 md:w-48 md:h-auto md:rounded rounded-full mx-auto"
              src={img3}
              alt="Equipo"
            />
            <div className="pt-6 md:p-4 text-center md:text-left space-y-4">
              <blockquote>
                <p className="text-l font-medium text-gray-700">
                  "Dominar las técnicas de primeros auxilios, RCP y manejo de DEA no solo te convierte en un héroe potencial, sino que también te empodera para actuar con confianza en situaciones de emergencia.”
                </p>
              </blockquote>
              <figcaption className="font-medium">
                <div className="text-blue-500">JULIAN PERUZZI</div>
                <div className="text-gray-700">TEC & DEV, ARGENTINA</div>
              </figcaption>
            </div>
          </figure>

          <figure className="md:flex bg-gray-100 rounded-xl p-8 md:p-0 w-full shadow-lg">
            <img
              className="w-24 h-24 md:w-48 md:h-auto md:rounded rounded-full mx-auto"
              src={img2}
              alt="Equipo"
            />
            <div className="pt-6 md:p-4 text-center md:text-left space-y-4">
              <blockquote>
                <p className="text-l font-medium text-gray-700">
                  "Aprender técnicas de RCP y el manejo del DEA no es solo un deber, es un llamado a la acción colectiva. Enfrentemos unidos la amenaza de la muerte súbita y el ahogamiento, elevando la conciencia y capacitando a todos.”
                </p>
              </blockquote>
              <figcaption className="font-medium">
                <div className="text-blue-500">FELIPE BUILES</div>
                <div className="text-gray-700">TEC, ARGENTINA</div>
              </figcaption>
            </div>
          </figure>


          <figure className="md:flex bg-gray-100 rounded-xl p-8 md:p-0 w-full shadow-lg">
            <img
              className="w-24 h-24 md:w-48 md:h-auto md:rounded rounded-full mx-auto"
              src={img1}
              alt="Equipo"
            />
            <div className="pt-6 md:p-4 text-center md:text-left space-y-4">
              <blockquote>
                <p className="text-l font-medium text-gray-700">
                  "Despierta el potencial que llevas dentro; con habilidades adecuadas y conocimientos sólidos, puedes convertirte en el faro que salva vidas y enciende esperanzas."
                </p>
              </blockquote>
              <figcaption className="font-medium">
                <div className="text-blue-500">JOSE MARIA NART</div>
                <div className="text-gray-700">PROF, ARGENTINA</div>
              </figcaption>
            </div>
          </figure>


        </div>
      )}

       <div className='flex justify-center border-b-4 p-4'>
        <button
          className="bg-zinc-500 hover:bg-black text-white font-bold py-2 px-4 mb-6 shadow"
          onClick={() => setMostrarMiembros(!mostrarMiembros)}
        >
          {mostrarMiembros ? 'Ocultar Equipo' : 'Mostrar Equipo'}
        </button>
      </div>

      <div className="text-center my-8">
        <Link to="/Contacto" className="bg-orange-500 hover:bg-black text-white font-bold py-2 px-4 my-6 shadow">
          Contáctanos
        </Link>
      </div>
    </aside>
  );
};
