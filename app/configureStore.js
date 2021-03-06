import devTools from 'remote-redux-devtools';
import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './redux/reducers';

import createSagaMiddleware from 'redux-saga'
import surveySaga from "./redux/sagas/surveySaga";

export default function configureStore():any {
  const sagaMiddleware = createSagaMiddleware();

  const enhancer = compose(
    applyMiddleware(sagaMiddleware),
    devTools({
      name: 'surveyapp', realtime: true,
    }),
  );

  const store = createStore(reducer, enhancer);
  sagaMiddleware.run(surveySaga);

  return store;
}
