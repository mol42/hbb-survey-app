import React, { PureComponent } from "react";
import { StyleSheet } from "react-native";
import { Provider } from 'react-redux';

import MainStackRouter from "./Routers/MainStackRouter";
import networkInfoService from "./services/NetworkInfoService";

class App extends PureComponent {

  constructor(props) {
    super(props);
    this.initializeServices();
  }

  initializeServices() {
    networkInfoService.initialize();
  }

  render() {
    return <MainStackRouter />;
  }
}

export default App;
