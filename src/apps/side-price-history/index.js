import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import client from 'lib/apollo-client';
import App from './App';

const container = document.createElement('div');
document.getElementById('tdo_8').closest('#msg_div_msg').appendChild(container);

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  container,
);
