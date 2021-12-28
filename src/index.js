import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import client from './apollo-client';
import App from './App';

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  container,
  // document.getElementById("root")
);
