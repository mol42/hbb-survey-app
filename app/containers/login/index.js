import React, { Component } from "react";
import { Image } from "react-native";
import { connect } from "react-redux";
import {
  Container,
  Content,
  Item,
  Input,
  Button,
  Icon,
  View,
  Text,
  Form
} from "native-base";
import { CustomText } from "../../components/CustomText";
import { Field, reduxForm } from "redux-form";
import { doLogin, informAppInitialized } from "../../redux/actions/auth";
import styles from "./styles";

class Login extends Component {
  
  static navigationOptions = {
    header: null
  };

  state = {
    username : "",
    password : ""
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.informAppInitialized();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.loginCompleted && !nextProps.auth.loginInProgress) {
      this.props.navigation.navigate("Home");
    }
  }

  render() {
    let {username, password} = this.state;
    return (
      <Container>
          <View style={styles.logo}>
            <Image source={require("../../../images/hatay-belediyesi.png")} />
          </View>
          <View style={styles.bg}>
            <Form>
              <Item>
                <Input placeholder="Kullanıcı adı" value={username} onChangeText={(value) => this.setState({username : value})} autoCapitalize={"none"} />
              </Item>
              <Item last>
                <Input placeholder="Şifre" value={password} secureTextEntry={true} onChangeText={(value) => this.setState({password : value})} autoCapitalize={"none"} />
              </Item>
            </Form>
            <Button
              style={styles.btn}
              onPress={() => this.props.doLogin(this.state)}
            >
              <CustomText>Giriş Yap</CustomText>
            </Button>
          </View>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    informAppInitialized : () => dispatch(informAppInitialized()),
    doLogin: (loginInfo) => dispatch(doLogin(loginInfo))
  };
}

const mapStateToProps = state => ({
  auth : state.auth
});

export default connect(mapStateToProps, bindAction)(Login);