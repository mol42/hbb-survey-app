import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import Home from '../app/containers/home';
import configureStore from '../app/configureStore';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

const store = configureStore();

it('renders correctly', () => {

  const component = renderer.create(
    <Provider store={store}>
      <Home />
    </Provider>
  );

  expect(component).toMatchSnapshot();
});
