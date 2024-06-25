import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
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
  };

  const handleClick = () => {
    setCount(count + 1);
    const currentClickTime = new Date().getTime();

    if (lastClickTime) {
      const intervalBetweenClicks = (currentClickTime - lastClickTime) / 1000;
      const currentRate = (1 / intervalBetweenClicks) * 60; // Ritmo en ppm

      setRate(currentRate.toFixed(2));

      if (currentRate >= 80 && currentRate <= 120) {
        setFeedback('¡Buen Ritmo!');
      } else {
        setFeedback('Ritmo incorrecto');
      }
    }

    setLastClickTime(currentClickTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-r from-rose-400 to-orange-300 ">
      {!gameStarted && (
        <div className="absolute  transform items-center text-center mx-4">
          <h1 className="text-4xl font-bold text-white mb-4">Bienvenido al Juego de RCP</h1>
          <p className="text-white mb-4 text-xl">Haz clic en el corazón para practicar RCP con el ritmo correcto (80-120 ppm).</p>
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-black" onClick={handleStartGame}>
            Iniciar Juego
          </button>
        </div>
      )}
      {gameStarted && (
        <>
          <div className="absolute top-4 md:top-10 left-4 md:left-32 text-2xl font-bold text-white select-none">
            Contador: {count}
          </div>
          <div className="absolute top-4 md:top-10 right-4 md:right-32 text-2xl text-white select-none">
            Ritmo: {rate} ppm
          </div>
          <div className={`text-4xl font-bold px-4 py-2 rounded mb-10 select-none mx-4 ${feedback === '¡Buen Ritmo!' ? 'bg-green-600' : 'bg-red-500'} text-white transition-opacity duration-300 ease-in-out ${feedback ? 'opacity-100' : 'opacity-0'}`}>
              {feedback}
            </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div 
              className=" text-red-500 cursor-pointer mb-4 active:text-rose-400" 
              onClick={handleClick}
              style={{ perspective: 1000 }}
            >               
              <FontAwesomeIcon 
                icon={faHeart} 
                size="10x" 
                className="transition-transform transform active:scale-75 hover:rotate-6"
              />
            </div>
            <div className="text-2xl text-white mb-4 select-none">
              Tiempo transcurrido: {formatTime(elapsedTime)}
            </div>
            <div className="text-xl text-white mt-4 select-none">
              Recuerda que el ritmo correcto es entre 80ppm y 120ppm
            </div>
            
          </div>
        </>
      )}
    </div>
  );
};

export default RcpGame;
