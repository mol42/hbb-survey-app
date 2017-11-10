
const React = require('react-native');

const { StyleSheet, Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;

export default {
  container: {

  },
  shadow: {
    flex: 1,
    width: null,
    height: null,
  },
  logo : {
    paddingTop: 50,
    alignItems : "center",
    justifyContent : "center"
  },
  bg: {
    flex:1
  },
  input: {
    marginBottom: 20,
  },
  btn: {
    marginTop: 20,
    alignSelf: 'center',
  },
};
