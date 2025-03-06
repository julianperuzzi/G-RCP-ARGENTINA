import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaStop, FaHeartbeat } from 'react-icons/fa'; // Iconos de React Icons
import AOS from 'aos';
import 'aos/dist/aos.css'; // Animaciones al hacer scroll

function RCPPractice() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pulseCount, setPulseCount] = useState(0);
  const [flash, setFlash] = useState(false);
  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);

  // Inicializar AOS para animaciones
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (isPlaying) {
      const beatInterval = 60000 / 110; // 110 bpm -> 60000 ms / 110 beats
      intervalRef.current = setInterval(playSound, beatInterval);
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
      setElapsedTime(0);
      setPulseCount(0);
    }
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const playSound = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    const oscillator = audioContextRef.current.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime); // A4
    oscillator.connect(audioContextRef.current.destination);
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.1); // sound duration 0.1s
    oscillatorRef.current = oscillator;

    setFlash(true);
    setTimeout(() => setFlash(false), 100);
    setPulseCount((prev) => prev + 1);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col justify-center items-center bg-cyan-950 min-h-screen pb-8">
      {/* Título Principal */}
      

      {/* Indicador de Ritmo */}
      <div
        className={`w-full h-40 flex items-center justify-center transition-all duration-200 ${
          flash ? 'bg-white' : 'bg-white/20'
        }`}
        
      >
        <FaHeartbeat
          className={`text-6xl ${
            flash ? 'text-green-500' : 'text-gray-100/50'
          } transition-all duration-200`}
        />
      </div>
      <h2
        className="text-3xl text-center text-gray-100 mt-8 font-extralight"
        data-aos="fade-down"
      >
        Práctica de RCP
      </h2>

      {/* Contenido Principal */}
      <div className="px-4 text-center mt-8" data-aos="fade-up">
        <p className="mb-6 text-lg text-gray-100">
          Utiliza este recurso para practicar RCP al ritmo de 110 pulsaciones por minuto.
        </p>

        {/* Botón de Inicio/Detener */}
        <button
          onClick={togglePlay}
          className="px-8 py-4 text-lg font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-md transition duration-300 flex items-center justify-center mx-auto"
        >
          {isPlaying ? (
            <>
              <FaStop className="mr-2" />
              Detener
            </>
          ) : (
            <>
              <FaPlay className="mr-2" />
              Iniciar
            </>
          )}
        </button>

        {/* Contadores */}
        <div className="mt-8 space-y-4">
          <div className="text-xl text-gray-100">
            Tiempo transcurrido: {Math.floor(elapsedTime / 60)}:
            {elapsedTime % 60 < 10 ? '0' : ''}
            {elapsedTime % 60} minutos
          </div>
          <div className="text-xl text-gray-100">
            Conteo de pulsaciones: {pulseCount}
          </div>
        </div>
      </div>

      {/* Mensaje Inferior */}
      <div
        className={`w-full h-40 flex items-center justify-center mt-8 transition-all duration-200 ${
          flash ? 'bg-green-500' : 'bg-green-400/30'
        }`}
        
      >
        <h2 className="text-4xl font-bold text-white text-center">
          GRCP ARGENTINA
        </h2>
      </div>
    </div>
  );
}

export default RCPPractice;