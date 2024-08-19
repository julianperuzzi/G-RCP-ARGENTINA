export const authConfig = {
    domain: process.env. VITE_AUTH0_DOMAIN,
    clientId: process.env.VITE_AUTH0_CLIENT_ID,
    redirectUri: window.location.origin,
  };
