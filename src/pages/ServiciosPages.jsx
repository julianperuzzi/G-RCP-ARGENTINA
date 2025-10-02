import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Building2, Users, X, Phone, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import img1After from '../assets/img servicios/servicio para escuelas 16-9.png';
import img2After from '../assets/img servicios/servicio para deportistas 16-9.png';
import img3After from '../assets/img servicios/servicio para empresas 16-9.png';
import img4After from '../assets/img servicios/servicio para comunidad 16-9.png';

const serviciosData = [
  {
    id: 1,
    title: 'Instituciones Educativas',
    subtitle: 'Formando héroes en las aulas',
    description: 'Programas de capacitación diseñados específicamente para escuelas y colegios, promoviendo una cultura de prevención y respuesta efectiva.',
    icon: GraduationCap,
    color: 'from-blue-500 to-blue-600',
    benefits: [
      'Certificación nacional válida',
      'Material didáctico incluido',
      'Adaptado a todas las edades',
      'Instructores especializados en educación'
    ],
    details: 'Nuestros programas educativos cubren desde nivel inicial hasta secundario, con metodologías adaptadas a cada grupo etario. Formamos a docentes y alumnos en primeros auxilios, RCP y prevención de accidentes escolares.',
    image: img1After,
  },
  {
    id: 2,
    title: 'Grupos Deportivos',
    subtitle: 'Seguridad en cada entrenamiento',
    description: 'Capacitación especializada para atletas, entrenadores y equipos deportivos. Respuesta rápida ante emergencias en la práctica deportiva.',
    icon: Heart,
    color: 'from-red-500 to-red-600',
    benefits: [
      'Enfoque en lesiones deportivas',
      'RCP para atletas de alto rendimiento',
      'Prevención de muerte súbita',
      'Protocolos específicos por deporte'
    ],
    details: 'Capacitamos en el manejo de emergencias deportivas: desde lesiones musculares hasta paros cardíacos. Incluye uso de DEA, manejo de trauma y protocolos de emergencia en competencias.',
    image: img2After,
  },
  {
    id: 3,
    title: 'Empresas',
    subtitle: 'Entorno laboral seguro',
    description: 'Soluciones integrales para la gestión de emergencias corporativas. Protegemos tu capital humano con capacitación profesional.',
    icon: Building2,
    color: 'from-orange-500 to-orange-600',
    benefits: [
      'Cumplimiento normativo laboral',
      'Brigadas de emergencia capacitadas',
      'Reducción de riesgos laborales',
      'Certificados para auditorías'
    ],
    details: 'Programas corporativos que incluyen formación de brigadas de emergencia, uso de DEA, primeros auxilios ocupacionales y planes de evacuación. Asesoramiento en equipamiento de seguridad.',
    image: img3After,
  },
  {
    id: 4,
    title: 'Comunidad General',
    subtitle: 'Ciudadanos que salvan vidas',
    description: 'Talleres abiertos para toda la comunidad. Empoderamos a la población con conocimientos que salvan vidas.',
    icon: Users,
    color: 'from-green-500 to-green-600',
    benefits: [
      'Horarios flexibles y accesibles',
      'No requiere conocimientos previos',
      'Práctica con maniquíes profesionales',
      'Certificado de asistencia'
    ],
    details: 'Cursos prácticos para el público general: RCP básica, maniobra de Heimlich, control de hemorragias, quemaduras y más. Capacitamos para actuar en emergencias cotidianas.',
    image: img4After,
  },
];

const ServiciosPages = () => {
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceClick = (serviceId) => {
    setSelectedService(serviceId);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Nuestros Servicios
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
            Capacitación profesional en primeros auxilios y RCP adaptada a tus necesidades
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="font-semibold">✓ Certificación Nacional</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="font-semibold">✓ Instructores Expertos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {serviciosData.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
                  
                  {/* Icon Badge */}
                  <div className={`absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg`}>
                    <Icon className={`w-8 h-8 bg-gradient-to-r ${service.color} bg-clip-text text-transparent`} strokeWidth={2.5} />
                  </div>

                  {/* Number Badge */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-gray-800">0{service.id}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-sm font-semibold text-orange-600 mb-3">
                    {service.subtitle}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center text-orange-600 font-semibold group-hover:gap-2 transition-all">
                    <span>Ver más detalles</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para capacitar a tu equipo?
          </h3>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Contáctanos y diseñaremos un programa personalizado para tus necesidades
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contacto"
              className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Solicitar Información
            </Link>
            <a
              href="https://wa.me/+5492645667981"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header with Image */}
            <div className="relative h-64 md:h-80">
              <img
                src={serviciosData[selectedService - 1].image}
                alt={serviciosData[selectedService - 1].title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${serviciosData[selectedService - 1].color} opacity-70`}></div>
              
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all shadow-lg group"
              >
                <X className="w-6 h-6 text-gray-800 group-hover:rotate-90 transition-transform" />
              </button>

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-2">
                  {React.createElement(serviciosData[selectedService - 1].icon, {
                    className: "w-10 h-10 text-white",
                    strokeWidth: 2.5
                  })}
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-white font-semibold">
                    0{serviciosData[selectedService - 1].id}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {serviciosData[selectedService - 1].title}
                </h2>
                <p className="text-xl text-white/90">
                  {serviciosData[selectedService - 1].subtitle}
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              {/* Description */}
              <div className="mb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {serviciosData[selectedService - 1].description}
                </p>
              </div>

              {/* Details */}
              <div className="mb-6 bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sobre este programa</h3>
                <p className="text-gray-700 leading-relaxed">
                  {serviciosData[selectedService - 1].details}
                </p>
              </div>

              {/* Benefits */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Beneficios incluidos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {serviciosData[selectedService - 1].benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contacto"
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 group"
                >
                  <Mail className="w-5 h-5" />
                  Solicitar Cotización
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://wa.me/+5492645667981"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-700 transition-all text-center flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiciosPages;
