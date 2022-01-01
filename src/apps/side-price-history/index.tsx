import { ApolloProvider } from '@apollo/client';
import Bugsnag from '@bugsnag/js';
import React from 'react';
import { render } from 'react-dom';

import client from 'src/lib/apollo-client';
import 'src/lib/bugsnag';

import App from './App';

const container = document.createElement('div');
container.style.zIndex = '1000';
container.style.position = 'absolute';

if (document.body.id !== 'skip-adding-apps') {
  document.body.appendChild(container);
}

const ErrorBoundary = Bugsnag.getPlugin('react')!.createErrorBoundary(React);

render(
  <React.StrictMode>
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  container,
);
