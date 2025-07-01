import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GlobalStyles from './styles/global';
import { ToastContainer } from 'react-toastify';

console.log('env:', import.meta.env);
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <ToastContainer />
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
