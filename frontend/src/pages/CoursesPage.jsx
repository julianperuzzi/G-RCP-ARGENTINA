import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/courses');
        setCourses(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error loading courses: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Cursos Disponibles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
              <p className="text-gray-700 mb-4">{course.description}</p>
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-bold">Price: ${course.price}</p>
                <p className="text-sm text-gray-600">Duration: {course.duration} mins</p>
              </div>
              <button
                onClick={() => handleBuy(course.id)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Función para manejar el clic en el botón de compra
const handleBuy = (courseId) => {
  // Lógica para manejar la compra, como redirigir al usuario a una página de pago
  alert(`Course ${courseId} added to cart.`);
};

export default CoursesPage;
