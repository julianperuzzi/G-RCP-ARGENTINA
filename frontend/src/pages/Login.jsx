// src/pages/Login.jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Logout
          </button>
          <a href="/profile">Profile</a>
        </>
      ) : (
        <button onClick={() => loginWithRedirect()}>Login</button>
      )}
    </div>
  );
};

export default Login;
