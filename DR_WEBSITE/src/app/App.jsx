import React from 'react';
import { AppProvider } from '../context/AppContext';
import Router from './Router';

const App = () => {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
};

export default App;