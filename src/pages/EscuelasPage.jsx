import React from 'react';

export const EscuelasPage = () => {
  const planesData = [
    {
      id: 'A',
      title: 'Taller pequeños preventores',
      targetAudience: 'Estudiantes Nivel inicial y primaria',
      content: [
        'Importancia de la prevención en la escuela y el hogar',
        'Cómo ayudar - Qué hacer y que NO hacer',
        'Práctica de situaciones básicas P. Auxilios',
        'Introducción al RCP'
      ],
      duration: '90 min'
    },
    {
      id: 'B',
      title: 'Taller "Más que profes"',
      targetAudience: 'Docentes y administrativos + staff general',
      content: [
        'Problemática de la Muerte súbita',
        'Soporte Vital Básico en la escuela',
        'Práctica de RCP',
        'Comunicación con equipos de emergencia',
        'Introducción a planes y brigadas de emergencia escolar'
      ],
      duration: '90 min'
    },
    {
      id: 'C',
      title: 'Taller Brigadistas en la escuela',
      targetAudience: 'Estudiantes líderes + docentes',
      content: [
        'Cadena de atención a victimas',
        'Concepto de equipo (en emergencias)',
        'Comunicación en emergencias',
        'Claves para el armado de las brigadas',
        'Planificación y simulacros',
        'Armado de plan de contingencia'
      ],
      duration: '90 min'
    },
    {
      id: 'D',
      title: 'Talleres "Mi escuela segura"',
      targetAudience: 'Estudiantes y cuerpo docente',
      content: [
        'Importancia de la prevención en la escuela y el hogar',
        'Cadena de atención a victimas',
        'Replicadores de RCP',
        'Problemática de la Muerte súbita',
        'Soporte Vital Básico en la escuela',
        'Práctica de RCP'
      ],
      duration: '90 min'
    },
    {
      id: 'E',
      title: 'Campaña Escuela cardioprotegida',
      targetAudience: 'Comisión directiva y Asoc. De padres',
      content: [
        'Consultoría para armado de plan de contingencia (3 meses)',
        'Consultoría para certificación de Institución CardioProtegida',
        'Asesoramiento para compra de insumos básicos de emergencia según características de la institución',
        'Acompañamiento para la articulación de las brigadas con el personal de emergencia y la continuidad del plan',
        'Diseño de señalética y material informativo institucional propio de la campaña'
      ],
      duration: '3 meses'
    }
  ];

  return (
    <div className="mx-auto py-8 p-4">
      <h1 className="text-3xl font-bold mb-8">Planes de Capacitación para Escuelas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {planesData.map(plan => (
          <div key={plan.id} className=" bg-slate-200 shadow-md rounded-md p-6 mb-4">
            <h2 className="text-xl font-bold mb-2">{plan.title}</h2>
            <p className="text-gray-700 mb-4">Dirigido a: {plan.targetAudience}</p>
            <ul className="list-disc list-inside">
              {plan.content.map((item, index) => (
                <li key={index} className="mb-2">{item}</li>
              ))}
            </ul>
            <p className="text-gray-700 mt-4">Duración: {plan.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


