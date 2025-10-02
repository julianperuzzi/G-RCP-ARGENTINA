import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Contacto = () => {
  const form = useRef();
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setEnviando(true);

    emailjs
      .sendForm('service_gdyf4jl', 'template_y0xgfug', form.current, {
        publicKey: '__jb6l56CCCKzd3nK',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          setEnviando(false);
          setEnviado(true);
          setTimeout(() => {
            setEnviado(false);
            form.current.reset();
          }, 5000);
        },
        (error) => {
          console.log('FAILED...', error.text);
          setEnviando(false);
        },
      );
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-6 animate-bounce" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Contáctanos
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos a la brevedad.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulario de Contacto */}
          <div className="bg-white rounded-2xl shadow-xl p-8 relative">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Envíanos un mensaje
              </h2>
              <p className="text-gray-600">
                Completa el formulario y nos pondremos en contacto contigo
              </p>
            </div>

            <form ref={form} onSubmit={sendEmail} className="space-y-6">
              <div>
                <label htmlFor="user_name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  id="user_name"
                  type="text"
                  name="user_name"
                  placeholder="Juan Pérez"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="user_email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <input
                  id="user_email"
                  type="email"
                  name="user_email"
                  placeholder="juan@ejemplo.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="user_phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono (opcional)
                </label>
                <input
                  id="user_phone"
                  type="tel"
                  name="user_phone"
                  placeholder="+54 9 264 123 4567"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={enviando}
                className={`w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                  enviando ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'
                }`}
              >
                {enviando ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Información de Contacto y WhatsApp */}
          <div className="space-y-6">
            {/* WhatsApp Card - Destacada */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <FontAwesomeIcon icon={faWhatsapp} className="text-4xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">¿Necesitas respuesta inmediata?</h3>
                  <p className="text-green-100">Chatea con nosotros por WhatsApp</p>
                </div>
              </div>
              
              <a
                href="https://wa.me/+5492645667981"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-green-600 font-bold py-4 px-6 rounded-xl hover:bg-green-50 transition-all text-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="mr-2" />
                Abrir WhatsApp
              </a>

              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Horario de atención: Lun-Vie 9:00-18:00</span>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Otras formas de contacto
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="bg-orange-100 rounded-full p-3">
                    <Phone className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Teléfono</h4>
                    <a href="tel:+5492645667981" className="text-gray-600 hover:text-orange-600">
                      +54 9 264 566 7981
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="bg-orange-100 rounded-full p-3">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <a href="mailto:gruporcpsa@gmail.com" className="text-gray-600 hover:text-orange-600 break-all">
                      gruporcpsa@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="bg-orange-100 rounded-full p-3">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ubicación</h4>
                    <p className="text-gray-600">
                      San Juan, Argentina
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Horarios de Atención */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-8 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Horarios de Atención
              </h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold">Lunes - Viernes:</span>
                  <span>8:00 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Sábados:</span>
                  <span>8:00 - 14:00</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="font-semibold">Domingos:</span>
                  <span>Cerrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Éxito */}
      {enviado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-scale-in text-center">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              ¡Mensaje Enviado!
            </h3>
            <p className="text-gray-600 mb-6">
              Gracias por contactarnos. Responderemos tu consulta a la brevedad.
            </p>
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-800">
                <strong>Tiempo estimado de respuesta:</strong> 24-48 horas hábiles
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contacto;
