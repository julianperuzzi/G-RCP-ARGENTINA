import React from 'react';
import imgCertificado from '../assets/img certificacion/Certificados  RCP Company.png';

const CertificacionOficial = () => {
  return (
    <section className="py-12 bg-gray-100 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-5">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Entrega de Certificación Oficial Avalada por Organismos Especializados</h2>
            <p className="text-lg text-gray-700 mb-6">
              Garantizamos estándares de excelencia en formación para primeros auxilios, rescate y técnicas médicas. Al obtener nuestra certificación, los participantes demuestran competencia validada por expertos en el campo, reflejando nuestro compromiso con la seguridad y el bienestar. Estamos comprometidos en proporcionar capacitación integral que permita enfrentar cualquier emergencia con profesionalismo y confianza, preparando a nuestros estudiantes para ser agentes de cambio en sus comunidades y salvaguardar vidas en situaciones críticas. Con una combinación de teoría sólida y práctica guiada por instructores altamente capacitados, nuestra certificación oficial representa un hito significativo en el desarrollo profesional y personal de nuestros participantes, abriendo oportunidades laborales y fortaleciendo la red de seguridad comunitaria.
            </p>
          </div>
          <div className="lg:w-1/2">
            <img src={imgCertificado} alt="Certificado" className="w-full rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificacionOficial;
