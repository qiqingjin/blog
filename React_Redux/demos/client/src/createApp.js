import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import App from 'components/App';

const AsyncMode = React.unstable_AsyncMode;
const createApp = (store) => (
  <AppContainer>
    <Provider store={store}>
      <AsyncMode>
        <App />
      </AsyncMode>
    </Provider>
  </AppContainer>
);

if (module.hot) {
  module.hot.accept();
}

export default createApp;