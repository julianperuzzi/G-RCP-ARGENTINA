import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import 'tailwindcss/tailwind.css';

const RcpGame = () => {
  const [count, setCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [rate, setRate] = useState(0);
  const [goodCount, setGoodCount] = useState(0);
  const [showSpecialMessage, setShowSpecialMessage] = useState(false);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (gameStarted) {
      const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const currentElapsedTime = (currentTime - startTime) / 1000;
        setElapsedTime(currentElapsedTime);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameStarted, startTime]);

  const handleStartGame = () => {
    setStartTime(new Date().getTime());
    setGameStarted(true);
    setCount(0);
    setGoodCount(0);
    setShowSpecialMessage(false);
  };

  const handleRestartGame = () => {
    // Reinicia el juego llevando al usuario de vuelta a la pantalla inicial
    setGameStarted(false); // Cambia el estado de inicio de juego a falso
    setElapsedTime(0);     // Resetea el tiempo transcurrido
    setCount(0);           // Resetea el contador de clics
    setGoodCount(0);       // Resetea el contador de buen ritmo
    setFeedback('');       // Resetea el mensaje de retroalimentación
    setRate(0);            // Resetea el ritmo
    setLastClickTime(null);// Resetea el último tiempo de clic
  };

  const handleClick = () => {
    setCount(count + 1);
    playClickSound(); // Reproduce el sonido en cada clic
    const currentClickTime = new Date().getTime();

    if (lastClickTime) {
      const intervalBetweenClicks = (currentClickTime - lastClickTime) / 1000;
      const currentRate = (1 / intervalBetweenClicks) * 60; // Ritmo en ppm

      setRate(currentRate.toFixed(2));

      if (currentRate >= 80 && currentRate <= 120) {
        setFeedback('¡Buen Ritmo!');
        setGoodCount((prev) => prev + 1);

        // Mostrar mensaje especial cada 30 buenas pulsaciones
        if ((goodCount + 1) % 30 === 0) {
          setShowSpecialMessage(true);
          setTimeout(() => setShowSpecialMessage(false), 1000); // Ocultar después de 1 segundo
        }
      } else {
        setFeedback('Ritmo incorrecto');
      }
    }

    setLastClickTime(currentClickTime);
  };

  const playClickSound = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    const oscillator = audioContextRef.current.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime); // A4
    oscillator.connect(audioContextRef.current.destination);
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.1); // Duración del sonido 0.1s
    oscillatorRef.current = oscillator;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <div className="relative flex flex-col items-center h-screen bg-gradient-to-r from-rose-400 to-orange-300 ">
      {!gameStarted && (
        <div className="absolute mt-40 transform items-center text-center  mx-4">
          <FontAwesomeIcon icon={faHeart} size="5x" className="text-white mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Bienvenido al Juego de RCP</h1>
          <p className="text-white mb-4 text-xl">Reglas: Haz clic en el corazón para practicar RCP con el ritmo correcto (80-120 ppm).</p>
          <button className="bg-orange-500 text-white text-xl px-4 py-2 rounded hover:bg-black" onClick={handleStartGame}>
            Iniciar Juego
          </button>
        </div>
      )}
      {gameStarted && (
        <div className="mx-4">
          
          <div className="absolute top-4 md:top-10 left-4 md:left-24 text-2xl font-bold text-white select-none">
            Contador: {count}
          </div>
          <div className="absolute top-12 md:top-24 left-4 md:left-24 text-2xl text-white select-none">
            Ritmo: {rate} ppm
          </div>

          

          <div className="flex flex-col items-center justify-center text-center ">
            <div
              className="text-white cursor-pointer mb-4 mt-24 active:text-white/90 active:bg-white/10 rounded-full p-5"
              onClick={handleClick}
              style={{ perspective: 1000 }}
            >
              <FontAwesomeIcon
                icon={faHeart}
                size="10x"
                className="transition-transform transform active:scale-75 "
              />
            </div>

            <div className={`text-4xl font-bold px-4 py-2 rounded  top-20  mx-auto  mb-4 text-center select-none ${feedback === '¡Buen Ritmo!' ? 'bg-green-600' : 'bg-red-500'} text-white transition-opacity duration-300 ease-in-out ${feedback ? 'opacity-100' : 'opacity-0'}`}>
            {feedback}
          </div>
            <div className="text-2xl text-white mb-4 select-none">
              Tiempo transcurrido: {formatTime(elapsedTime)}
            </div>
            <div className="text-xl text-white mt-4 select-none">
              Recuerda que el ritmo correcto es entre 80ppm y 120ppm
            </div>
            <button 
              className="mt-8 bg-white/50 text-black text-lg px-4 py-2 rounded hover:bg-gray-100"
              onClick={handleRestartGame}
            >
              Reiniciar Juego
            </button>
            
          </div>
          {showSpecialMessage && (
            <div className="absolute top-20 md:mx-auto bg-blue-600 text-white text-xl font-bold p-4 rounded-lg shadow-lg mx-4">
              ¡Excelente! Más de 30 pulsaciones a buen ritmo.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RcpGame;
