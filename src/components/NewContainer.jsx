import { Link } from 'react-router-dom';
import { NewArticle } from './NewArticle';
import React from 'react';

export const NewContainer = () => {
  return (
    <aside className="bg-DarkBlue text-white p-5">
      
      <h1 className="text-SoftOrange text-4xl font-bold cursor-default">BLOG</h1>
      

        <NewArticle 
          title='La Importancia Vital de Saber RCP'
          text='Aprender RCP puede salvar vidas al proporcionar confianza y seguridad en emergencias cardíacas críticas.'
        />
   

   
        <NewArticle 
          title='El Manejo de DEA: Un Pilar en la Cadena de Supervivencia'
          text='El manejo de DEA aumenta las tasas de supervivencia durante un paro cardíaco, siendo vital para reducir daños.'
        />
     

     
        <NewArticle 
          title='Primeros Auxilios: La Primera Línea de Defensa en Emergencias'
          text='Los primeros auxilios previenen complicaciones graves y salvan vidas antes de la ayuda profesional, esencial en emergencias.'
        />
     
    </aside>
  );
};
