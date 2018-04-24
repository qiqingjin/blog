import 'styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './createStore';
import createApp from './createApp';

const serverData = window._SERVER_DATA || {};
const store = createStore(serverData);
const render = () => {
  //const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;
  ReactDOM.hydrate(
    createApp(store),
    document.getElementById('app')
  );
};

render();