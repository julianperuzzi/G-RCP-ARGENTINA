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
    <div className="flex flex-col justify-center items-center bg-cyan-950 py-8 ">
      <div className="w-full">
        {flash ? (
          <div className="w-full h-40 bg-white"></div>
        ) : (
          <div className="w-full h-40 bg-white/20"></div>
        )}
      </div>
      <div className="px-4 text-center">
        <h2 className="text-5xl font-bold mt-16 mb-6 text-gray-100">
          RITMO RCP
        </h2>
        <p className="mb-4 text-lg text-gray-100">
          Utiliza este recurso para practicar RCP
        </p>
        <button
          onClick={togglePlay}
          className="px-6 py-3  text-lg font-medium transition bg-green-500 text-white hover:bg-orange-500 mb-4"
        >
          {isPlaying ? 'Detener' : 'Iniciar'} Pulsaciones
        </button>
        <div className="text-xl text-gray-50 mb-4">
          Tiempo transcurrido: {Math.floor(elapsedTime / 60)}:
          {elapsedTime % 60 < 10 ? '0' : ''}
          {elapsedTime % 60} minutos
        </div>
        <div className="text-xl text-gray-50 mb-16">
          Conteo de pulsaciones: {pulseCount}
        </div>
        
      </div>
      {flash ? (
        <div className="w-full h-40 bg-green-500"> <h2 className="text-4xl font-bold my-16 text-white text-center">
        GRCP ARGENTINA
      </h2></div>
      ) : (
        <div className="w-full h-40 bg-green-400/30"> <h2 className="text-4xl font-bold my-16 text-white/70 text-center">
        GRCP ARGENTINA
      </h2></div>
      )}
    </div>
  );
}

export default RCPPractice;
