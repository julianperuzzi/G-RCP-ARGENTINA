import React, { useState } from 'react';
import img3 from '../assets/julian perfil.png';
import img1 from '../assets/jisu perfil.jpeg';
import empresaLogo from '../assets/logo white g rcp.pptx.svg';
import otroLogo from '../assets/lodo dark g rcp.pptx.svg';


export const Equipo = () => {
  const [mostrarMiembros, setMostrarMiembros] = useState(false);

  return (
    <aside className="px-4 py-6 bg-gray-900 text-white">
      <div className="container">
        <img src={otroLogo} alt="Otro logo de la empresa" className="mx-auto mb-4" style={{ maxWidth: '300px' }} />
        <div className="flex items-center justify-center bg-gray-100 p-4 mb-4">
          <img src={empresaLogo} alt="Logo de la empresa" className="w-24 h-24 mr-4" />
          <div>
            <h2 className="text-4xl font-bold mb-2 text-AzulOscuro">Nosotros</h2>
            <p className='text-AzulOscuro text-l'>Somos una empresa comprometida con la seguridad y el bienestar de la comunidad.</p>
          </div>
        </div>

        <div className="mt-4 mx-10 text-[14px] sm:mx-40 md:text-[16px] text-justify">
          <h2 className="font-bold pt-4">Misión:</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident consectetur voluptate porro ducimus nulla voluptatum voluptas adipisci animi, odit laboriosam laborum, facilis mollitia, quod fugit eos. Nihil, accusamus! Minus, voluptate.</p>
          <h2 className="font-bold mt-4 border-t-2 pt-4">Visión:</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus numquam itaque quisquam eligendi culpa fuga quis, aliquid voluptas nesciunt laborum reprehenderit excepturi recusandae repellat veniam alias earum eveniet unde necessitatibus!</p>
          <h2 className="font-bold mt-4 border-t-2 pt-4">Objetivo:</h2>
          <p>Buscamos ser participes y generadores de acciones preventivas para la comunidad en general para acabar (o al menos disminuir) las epidemias de las que poco se habla: EL AHOGAMIENTO Y LA MUERTE SÚBITA..</p>
        </div>
      </div>

      <div className="flex text-center justify-center ">
        <h2 className="text-3xl font-bold mb-2">Nuestro Equipo</h2>
      </div>




      {mostrarMiembros && (
        <div className="flex flex-wrap justify-center gap-8">
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
              src={img3}
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

      <div className="text-center">
        <button className="bg-orange-500 hover:bg-black text-white font-bold py-2 px-4 my-6 shadow">
          Contáctanos
        </button>
      </div>
    </aside>
  );
};
