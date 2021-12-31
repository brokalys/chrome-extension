import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { render } from 'react-dom';

import client from 'src/lib/apollo-client';

import App from './App';

const container = document.createElement('div');
container.style.zIndex = '1000';
container.style.position = 'absolute';
document.body.appendChild(container);

render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  container,
);
