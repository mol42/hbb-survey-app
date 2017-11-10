
import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';

import App from './App';
import configureStore from './configureStore';

const store = configureStore();

function setup() {

  class Root extends PureComponent {

    render() {
      return (
        <Provider store={store}>
          <App />
        </Provider>
      );
    }
  }

  return Root;
}

export default setup;
