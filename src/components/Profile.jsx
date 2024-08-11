// src/components/Profile.jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <div>No estás autenticado</div>;
  }

  return (
    <div>
      <h2>Perfil</h2>
      <img src={user.picture} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
};

export default Profile;
