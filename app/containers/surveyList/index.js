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
import { getSurveyList, setSelectedSurvey, filterSurveyList } from "../../redux/actions/survey";
import styles from "./styles";

class SurveyList extends Component {
  
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getSurveyList();
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
              <Title>Anket Listesi</Title>
            </Body>

            <Right>
            </Right>
        </Header>
        <Content>
          <View style={styles.bg}>
            <FlatList
                data={this.props.survey.surveyList}
                keyExtractor={item => item.surveyId}
                renderItem={this._renderItem}
                ListHeaderComponent={this._renderHeader}
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
                  <Icon name="ios-add-circle" style={{fontSize: 32, color: 'blue'}} onPress={() => {
                    this.props.setSelectedSurvey(item);
                    this.props.navigation.navigate("SurveyWizard");
                  }} />
                </Col>
              </Row>
            </View>)
  }

  _renderHeader = () => {
    return <SearchBar placeholder="Anket adı ile arayın..." lightTheme round clearButtonMode={"always"} onChangeText={(newText) => this.props.filterSurveyList(newText)} />;
  };

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
    filterSurveyList : newText => dispatch(filterSurveyList(newText)),
    setSelectedSurvey : survey => dispatch(setSelectedSurvey(survey)),
    getSurveyList: index => dispatch(getSurveyList())
  };
}

const mapStateToProps = state => ({
    survey : state.survey
});

export default connect(mapStateToProps, bindAction)(SurveyList);