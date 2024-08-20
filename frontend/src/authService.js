// src/authService.js
const API_URL = ' http://localhost:3000'; // Reemplaza con tu URL de backend

// Función para iniciar sesión
export async function login(email, password) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Error al iniciar sesión');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token); // Guarda el token en localStorage
}

// Función para cerrar sesión
export function logout() {
  localStorage.removeItem('token'); // Elimina el token de localStorage
}

// Función para obtener el usuario autenticado
export async function getUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const response = await fetch(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener datos del usuario');
  }

  return response.json();
}
