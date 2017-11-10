import React, { Component } from "react";
import { TouchableOpacity, View, AsyncStorage, Alert, Keyboard } from "react-native";
import { connect } from "react-redux";
import { DrawerNavigator, NavigationActions } from "react-navigation";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
  Card,
  CardItem
} from "native-base";
import { CustomText } from "../../components/CustomText";
import { Grid, Row, Col } from "react-native-easy-grid";
import { doLogout } from "../../redux/actions/auth";
import { getSurveyList, setSelectedSurvey, getCompletedSurveyList } from "../../redux/actions/survey";
import styles from "./styles";

class Home extends Component {

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    Keyboard.dismiss();
    this.props.getSurveyList();
    this.props.getCompletedSurveyList();
  }

  render() {
    let {originalSurveyList} = this.props.survey;
    let latestSurvey = originalSurveyList.length ? originalSurveyList[0] : null;

    return (
      <Container style={styles.container}>
        <Header>
          <Left>

            <Button
              transparent
              onPress={() => {

                Alert.alert(
                  'Çıkış Uyarısı',
                  'Oturumunuzu sonlandırmak istediğinize emin misiniz ?',
                  [
                    {text: 'İptal', onPress: () => {}, style: 'cancel'},
                    {text: 'Evet', onPress: () => {
                      this.props.logoutAction();
                      this.props.navigation.goBack();
                    }},
                  ],
                  { cancelable: false }
                )
              }}
            >
              <Icon active name="power" />
            </Button>
          </Left>

          <Body>
            <Title>Ana Sayfa</Title>
          </Body>

          <Right>

          </Right>
        </Header>
        <Content>
          <View style={{width: "90%", marginLeft : "5%", marginTop : 20}}>
            <Card>
              <CardItem>
                <Body>
                    <Row>
                      <Col size={30}><Icon name="md-person" style={{fontSize: 32}}/></Col>
                      <Col size={70}><CustomText style={{fontSize : 18}}>{this.props.auth.user.username}</CustomText></Col>
                    </Row>
                    <Row>
                      <Col size={30}></Col>
                      <Col size={70}>{originalSurveyList.length > 0 ? <CustomText>Aktif {originalSurveyList.length} anket var</CustomText> : <CustomText>Aktif anket yoktur</CustomText>}</Col>
                    </Row>
                </Body>
              </CardItem>
            </Card>
          </View>
          <Grid style={styles.mt}>
              <Row>
                <Col>
                  <Card style={{width: "90%", marginLeft : "5%"}}>
                    <CardItem style={{backgroundColor : "#eee", paddingTop : 5, paddingBottom : 5}}>
                        <Icon name="ios-list-box-outline" style={{color : "black"}} /><CustomText style={{fontSize : 15, fontWeight : "500"}}>Son Aktif Anket</CustomText>
                    </CardItem>
                    <CardItem>
                      {this._renderLatestSurveyBody(latestSurvey)}
                    </CardItem>
                  </Card>
                </Col>
              </Row>
              <Row style={{marginTop: 10}}>
                <Col style={{width: "90%", marginLeft : "5%"}}>
                  <Button onPress={() => this.props.navigation.navigate("SurveyList")} style={{width: "100%", justifyContent : "center"}}>
                    <Row>
                      <Col size={15}><Icon name="ios-list-box-outline" style={{color : "white", marginLeft: 10, marginRight: 0}} /></Col>
                      <Col size={85} style={{justifyContent : "center"}}><CustomText style={{paddingLeft: 0}}>Anket Listesi</CustomText></Col>
                    </Row>
                  </Button>
                </Col>
              </Row>
              <Row style={{marginTop: 10}}>
                <Col style={{width: "90%", marginLeft : "5%"}}>
                  <Button onPress={() => this.props.navigation.navigate("Last5MinCompletedSurveyList")} style={{width: "100%", justifyContent : "center"}}>
                    <Row>
                      <Col size={15}><Icon name="ios-checkmark-circle-outline" style={{color : "white", marginLeft: 10, marginRight: 0}}></Icon></Col>
                      <Col size={85} style={{justifyContent : "center"}}><CustomText style={{paddingLeft: 0}}>Tamamlanmış Anketler (Son 5 Dk)</CustomText></Col>
                    </Row>
                  </Button>
                </Col>
              </Row>  
              <Row style={{marginTop: 10}}>
                <Col style={{width: "90%", marginLeft : "5%"}}>
                  <Button onPress={() => this.props.navigation.navigate("CompletedSurveyList")} style={{width: "100%", justifyContent : "center"}}>
                    <Row>
                      <Col size={15}><Icon name="ios-checkmark-circle-outline" style={{color : "white", marginLeft: 10, marginRight: 0}}></Icon></Col>
                      <Col size={85} style={{justifyContent : "center"}}><CustomText style={{paddingLeft: 0}}>Tamamlanmış Anketler</CustomText></Col>
                    </Row>
                  </Button>
                </Col>
              </Row>                          
          </Grid>
        </Content>
      </Container>
    );
  }

  _renderLatestSurveyBody(latestSurvey) {
    
    if(!latestSurvey) {
      return <CustomText>Aktif anket bulunamadı</CustomText>;
    }

    return (<Content>
              <Row onPress={() => this._setSelectedSurvey(latestSurvey)}>
                <Col size={80} style={{justifyContent : "center"}}>
                  <CustomText>{latestSurvey.name}</CustomText>
                </Col>
                <Col size={20} style={{alignItems : "flex-end"}}>
                  <Icon name="ios-add-circle" style={{fontSize: 32, color: 'blue'}} />
                </Col>
              </Row>
            </Content>);
  }

  _setSelectedSurvey = (survey) => {
    this.props.setSelectedSurvey(survey);
    this.props.navigation.navigate("SurveyWizard");
  }
}

function bindAction(dispatch) {
  return {
    logoutAction : () => dispatch(doLogout()),
    setSelectedSurvey : (survey) => dispatch(setSelectedSurvey(survey)),
    getSurveyList: () => dispatch(getSurveyList()),
    getCompletedSurveyList: () => dispatch(getCompletedSurveyList())
  };
}

const mapStateToProps = state => ({
  auth : state.auth,
  survey : state.survey
});

export default connect(mapStateToProps, bindAction)(Home);
