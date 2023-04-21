import React from 'react';
import Portuguese from './pages/Portuguese';
import Home from './pages/English';

const routes = {
  '/': () => <Home />,
  '/br': () => <Portuguese />,
};
export default routes;
