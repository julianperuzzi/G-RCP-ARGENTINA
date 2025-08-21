import React, { useEffect } from 'react';
import { Parallax } from 'react-parallax';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Calendar, Award, Clock } from 'lucide-react';

export const Banner = () => {
  useEffect(() => {
    AOS.init({ 
      duration: 1500,
      once: true,
      easing: 'ease-in-out-quart'
    });
  }, []);

  // Datos de certificaciones (nuevo contenido en lugar de repetir sectores)
  const certifications = [
    {
      icon: Shield,
      title: "Certificación Nacional",
      description: "Válida en todo el país"
    },
    {
      icon: Calendar,
      title: "Cursos Regulares",
      description: "Programación mensual de capacitaciones"
    },
    {
      icon: Award,
      title: "Instructores Certificados",
      description: "Profesionales con amplia experiencia"
    },
    {
      icon: Clock,
      title: "Horarios Flexibles",
      description: "Adaptamos a tus necesidades"
    }
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Sección Hero con Parallax */}
      <Parallax
        strength={200}
        bgImage="https://i.pinimg.com/1200x/df/4b/4d/df4b4d079320b7b709759a0912badc22.jpg"
        bgImageStyle={{ 
          objectFit: 'cover',
          filter: 'brightness(1)'
        }}
        className="relative"
      >
        {/* Overlays y efectos */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
        
        
        {/* Contenido principal */}
        <div className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
          {/* Título con efecto gradiente */}
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-300">
              GRCP ARGENTINA
            </span>
          </h1>
          
          {/* Subtítulo */}
          <p 
            className="text-xl md:text-2xl text-white/90 font-light tracking-wider uppercase mb-8 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Rescate • Capacitación • Prevención
          </p>
          
          {/* Líneas decorativas */}
          <div 
            className="w-64 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent my-4"
            data-aos="fade"
            data-aos-delay="600"
          />
          
          {/* Botón CTA */}
          <Link
            to="/contacto"
            className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-8 py-3 rounded-full text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-orange-500/30"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <span>Contactar</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Parallax>

      {/* Sección de información */}
      <div className="relative py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Logo */}
            <div 
              className="lg:w-1/4 flex justify-center"
              data-aos="fade-right"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500 -z-10" />
                <div className="bg-white  rounded-2xl shadow-xl border border-gray-100 transform group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src="https://i.pinimg.com/1200x/14/de/ee/14deee455a218bb8be843b5e70e21807.jpg" 
                    alt="Logo GRCP" 
                    className="w-60 h-60 object-cover" 
                  />
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div 
              className="lg:w-3/4"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="border-l-4 border-orange-500 pl-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Formación <span className="text-orange-600">Certificada</span> en Primeros Auxilios
                </h2>
                
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Nuestros programas de capacitación están diseñados para brindar conocimientos prácticos y actualizados en reanimación cardiopulmonar y primeros auxilios, con el respaldo de:
                </p>
                
                {/* Lista de certificaciones (nuevo contenido) */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {certifications.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Botón */}
                <Link
                  to="/Nosotros"
                  className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                >
                  <span>Conoce nuestros programas</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Efecto de borde inferior */}
      <div className="h-1 bg-gradient-to-r from-orange-600 via-red-500 to-orange-600" />
    </section>
  );
};

export default Banner;