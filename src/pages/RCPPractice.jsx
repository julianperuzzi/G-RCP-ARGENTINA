import React, { useState, useEffect, useRef } from 'react';

function RCPPractice() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pulseCount, setPulseCount] = useState(0);
  const [flash, setFlash] = useState(false);
  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (isPlaying) {
      const beatInterval = 60000 / 100; // 100 bpm -> 60000 ms / 100 beats
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
    <div className="flex flex-col items-center justify-center  bg-gray-100 dark:bg-gray-900 h-svh">
      <div className="w-full h-32">
      {flash ? <div className="w-full h-32 bg-green-500"></div> : <div className="w-full h-32 bg-green-400/30"></div>}
      </div>
      <h1 className="text-4xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">
        Practica RCP
      </h1>
      <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
        Utiliza este recurso para practicar RCP, escuchando un tono o música para encontrar el ritmo correcto.
      </p>
      <button
        onClick={togglePlay}
        className="px-6 py-3 rounded-md text-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700 mb-4"
      >
        {isPlaying ? 'Detener' : 'Iniciar'} Pulsaciones
      </button>
      <div className="text-xl text-gray-700 dark:text-gray-300 mb-4">
        Tiempo transcurrido: {Math.floor(elapsedTime / 60)}:{elapsedTime % 60 < 10 ? '0' : ''}{elapsedTime % 60} minutos
      </div>
      <div className="text-xl text-gray-700 dark:text-gray-300 mb-16">
        Conteo de pulsaciones: {pulseCount}
      </div>
      {flash ? <div className="w-full h-32 bg-green-500"></div> : <div className="w-full h-32 bg-green-400/30"></div>}
    </div>
  );
}

export default RCPPractice;
