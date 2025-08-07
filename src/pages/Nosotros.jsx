import React, { useEffect } from 'react';
import { Parallax } from 'react-parallax';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Eye, Award } from 'lucide-react';

export const Nosotros = () => {
  useEffect(() => {
    AOS.init({ 
      duration: 1000,
      once: true
    });
  }, []);

  // Datos del equipo
  const teamMembers = [
    {
      img: 'https://i.pinimg.com/736x/00/8a/ff/008affc1771bf3fc82ec1c18f0b1e49f.jpg',
      name: 'JULIAN PERUZZI',
      role: 'TEC & DEV',
      quote: '"Dominar las técnicas de primeros auxilios, RCP y manejo de DEA no solo te convierte en un héroe potencial, sino que también te empodera para actuar con confianza en situaciones de emergencia."'
    },
    {
      img: 'https://i.pinimg.com/736x/ed/cf/d6/edcfd66796e4819166bb24c62e288244.jpg',
      name: 'FELIPE BUILES',
      role: 'TEC',
      quote: '"Aprender técnicas de RCP y el manejo del DEA no es solo un deber, es un llamado a la acción colectiva. Enfrentemos unidos la amenaza de la muerte súbita y el ahogamiento."'
    },
    {
      img: 'https://i.pinimg.com/736x/59/9a/4d/599a4df6d912225d971e2e1f7322098b.jpg',
      name: 'JOSE MARIA NART',
      role: 'LIC. y PROF.',
      quote: '"Despierta el potencial que llevas dentro; con habilidades adecuadas y conocimientos sólidos, puedes convertirte en el faro que salva vidas y enciende esperanzas."'
    }
  ];

  // Secciones de información
  const sections = [
    {
      title: "Misión",
      icon: Target,
      content: "Nuestra misión es capacitar a instituciones educativas y empresas en técnicas de reanimación cardiopulmonar (RCP), primeros auxilios, soporte vital básico y manejo de desfibriladores externos automáticos (DEA).",
      img: 'https://i.pinimg.com/736x/fb/7e/52/fb7e52f03a6748dc043f242bd7958886.jpg'
    },
    {
      title: "Visión",
      icon: Eye,
      content: "Nos visualizamos como líderes en la capacitación en RCP, primeros auxilios, soporte vital básico y manejo de DEA para instituciones educativas y empresas. Aspiramos a ser reconocidos por nuestra calidad en la formación.",
      img: 'https://i.pinimg.com/736x/b3/fd/7d/b3fd7d18c717d67a248d7bd3637d4b88.jpg'
    },
    {
      title: "Objetivo",
      icon: Award,
      content: "Buscamos ser partícipes y generadores de acciones preventivas para la comunidad en general para acabar (o al menos disminuir) las epidemias de las que poco se habla: el Ahogamiento y la Muerte Súbita.",
      img: 'https://i.pinimg.com/736x/51/6d/42/516d425c8654463585d17fa1b42ec2ad.jpg'
    }
  ];

  return (
    <section className="bg-white text-gray-900">
      {/* Hero Section */}
      <Parallax
        strength={600}
        bgImage="https://i.pinimg.com/736x/a3/78/12/a378128ca7cc1952458e6395d82343fa.jpg"
        bgImageStyle={{ 
          objectFit: 'cover',
          filter: 'brightness(0.7)'
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
            data-aos="fade-up"
          >
            GRUPO DE RESCATE, CAPACITACIÓN Y PREVENCIÓN
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90 font-light tracking-wider uppercase mb-8 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Capacitación, Prevención y Salvamento en Emergencias
          </p>
        </div>
      </Parallax>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-center mb-16">
          <img 
            src="https://i.pinimg.com/736x/a6/b0/fb/a6b0fb91d12544bee7a3a55758bf9186.jpg" 
            alt="Logo GRCP" 
            className="w-32 h-32 md:w-48 md:h-48 object-cover" 
            data-aos="fade-right"
          />
          <div 
            className="md:pl-12 mt-8 md:mt-0"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
              <span className="relative z-10">Sobre Nosotros</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 z-0"></span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
              Somos una organización comprometida con la seguridad y el bienestar de la comunidad a través de capacitaciones profesionales en RCP y primeros auxilios.
            </p>
          </div>
        </div>

        {/* Mission, Vision, Objective */}
        <div className="space-y-20">
          {sections.map((section, index) => (
            <div 
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="md:w-1/2">
                <div className="relative group overflow-hidden rounded-xl shadow-2xl">
                  <img 
                    src={section.img} 
                    alt={section.title} 
                    className="w-full h-80 md:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="flex items-center gap-4 mb-6">
                  <section.icon className="w-10 h-10 text-orange-500" />
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{section.title}</h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              data-aos="fade-up"
            >
              Nuestro <span className="text-orange-500">Equipo</span>
            </h2>
            <div 
              className="w-20 h-1 bg-orange-500 mx-auto"
              data-aos="fade-up"
              data-aos-delay="100"
            ></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="relative h-64">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-orange-600 font-medium mb-4">{member.role}, ARGENTINA</p>
                  <blockquote className="text-gray-600 italic">
                    "{member.quote}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 text-center bg-gradient-to-r from-orange-50 to-red-50">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-8"
          data-aos="fade-up"
        >
          ¿Listo para capacitarte con nosotros?
        </h2>
        <Link
          to="/Contacto"
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <span>Contáctanos</span>
          <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
};