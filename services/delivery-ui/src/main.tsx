import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { LocalStorageKey, getJwtPayloadFromJwt, theme, useAuthStore } from './core';

const init = () => {
  const authStore = useAuthStore.getState();

  const accessToken = localStorage.getItem(LocalStorageKey.AccessToken);

  if (!accessToken) {
    authStore.unauthenticate();
    return;
  }

  const jwtPayload = getJwtPayloadFromJwt(accessToken);

  if (!jwtPayload) {
    authStore.unauthenticate();
    return;
  }

  // Access token has expired
  if (Date.now() >= jwtPayload.exp * 1000) {
    authStore.unauthenticate();
    localStorage.removeItem(LocalStorageKey.AccessToken);
    return;
  }

  authStore.authenticate(accessToken, {
    id: jwtPayload.id,
    email: jwtPayload.email,
    firstname: jwtPayload.firstname,
    lastname: jwtPayload.lastname,
    companyId: jwtPayload.companyId,
    companyName: jwtPayload.companyName,
  });
};

init();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
