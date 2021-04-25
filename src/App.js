/* global chrome */

import { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  useEffect(() => {
    setTimeout(() => {
      console.log('send message')
      window.postMessage({ type: "GET_EXTENSION_ID" }, "*");

      chrome.tabs.query({active: true, currentWindow: true},function(tabs) {
                     chrome.tabs.sendMessage(tabs[0].id, {message: "hello"}, () => {
                       console.log('callback??', arguments)
                     });
                   });
    }, 1000);
  }, []);

  useEffect(() => {
    // Set up event listeners from Content script
    window.addEventListener("message", function(event) {
      if (event.source !== window) return;
      console.log('got message', event.data)
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
