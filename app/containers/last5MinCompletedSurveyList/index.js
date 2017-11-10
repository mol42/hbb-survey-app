import React, { Component } from "react";
import { Image, FlatList } from "react-native";
import { connect } from "react-redux";
import {
  Container,
  Content,
  Header,
  Button,
  Icon,
  View,
  Text,
  Row,
  Col,
  Left,
  Right,
  Body,
  Title
} from "native-base";
import { CustomText } from "../../components/CustomText";
import { SearchBar } from "react-native-elements";
import { 
  getCompletedSurveyListLast5Min, 
  setCompletedSurveyAndChoiceList 
} from "../../redux/actions/survey";
import styles from "./styles";
import moment from "moment";

class Last5MinCompletedSurveyList extends Component {
  
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getCompletedSurveyListLast5Min();
  }

  render() {
    return (
      <Container style={{backgroundColor : "white"}}>
        <Header>
            <Left>
              <Button
                  transparent
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                >
                  <Icon active name="md-arrow-dropleft-circle" />
              </Button>
            </Left>

            <Body>
              <Title>Son Anketler</Title>
            </Body>

            <Right>
            </Right>
        </Header>
        <Content>
          <View style={styles.bg}>
            <FlatList
                data={this.props.survey.choiceOwner.last5Min.choiceOwnerList}
                keyExtractor={item => item.choiceOwnerId}
                renderItem={this._renderItem}
                ListEmptyComponent={this._renderEmptyList}
                ItemSeparatorComponent={this._renderSeparator}
            />
          </View>
        </Content>
      </Container>
    );
  }

  _renderItem = ({item}) => {
    return (<View style={{paddingTop : 10, paddingBottom : 10, paddingLeft : 8}}>
              <Row>
                <Col size={80}><CustomText style={{fontSize : 16}}>{item.name}</CustomText></Col>
                <Col size={20} style={{alignItems : "flex-end", paddingRight: 8}}>
                  <Icon name="ios-create" style={{fontSize: 32, color: 'blue'}} onPress={() => {
                    this.props.setCompletedSurveyAndChoiceList(item.choiceOwnerId);
                    this.props.navigation.navigate("SurveyWizard");
                  }} />
                </Col>
              </Row>
              <Row>
                <Col size={36}><CustomText style={{fontWeight : "bold"}}>Eklenme Tarihi : </CustomText></Col>
                <Col size={64}><CustomText style={{fontSize : 16}}>{moment(item.createDate).format("DD.MM.YYYY hh:mm")}</CustomText></Col>
              </Row>
            </View>)
  }

  _renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#CED0CE"
        }}
      />
    );
  }

  _renderEmptyList = () => {
    return (<View style={{alignItems : "center", marginTop: 100}}>
              <Icon name="md-warning" style={{fontSize : 32}} />
              <CustomText>Anket bulunamadı</CustomText>
            </View>)
  }
}

function bindAction(dispatch) {
  return {
    setCompletedSurveyAndChoiceList : choiceOwnerId => dispatch(setCompletedSurveyAndChoiceList(choiceOwnerId)),
    getCompletedSurveyListLast5Min: () => dispatch(getCompletedSurveyListLast5Min())
  };
}

const mapStateToProps = state => ({
    survey : state.survey
});

export default connect(mapStateToProps, bindAction)(Last5MinCompletedSurveyList);