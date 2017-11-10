
import React, { PureComponent } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import SurveyQuestion from '../../components/SurveyQuestion/SurveyQuestion';
import ChoiceOwnerForm from "../../components/ChoiceOwnerForm/ChoiceOwnerForm";
import {
    Button,
    Icon,
    Container,
    Content,
    Left,
    Right,
    Header,
    Body,
    Title,
    Card,
    CardItem,
    Row,
    Col,
    Text
} from "native-base";
import { CustomText } from "../../components/CustomText";
import { connect } from "react-redux";
import { 
  showNextQuestion, 
  showPreviousQuestion, 
  initializeNavigationState,
  updateChoices,
  createChoices,
  updateSavedChoices,
  startSurvey,
  setSelectedDistrictOptions,
  updateChoiceOwnerName
} from "../../redux/actions/survey";
import {
  getDistrictList,
  getNeighbourHoodOfDistrict
} from "../../redux/actions/district";

class SurveyWizard extends PureComponent {
  
    static navigationOptions = {
        header: null
    };
  
    state = {
      routes: [],
    };

    constructor(props) {
      super(props);
    }

    componentWillMount() {

      if (this.props.selectedSurvey.surveyId) {

        // TODO(tayfun): move this logic to redux side...
        const questions = this.props.selectedSurvey.questions;
        let routes = []

        questions.forEach((survey, index) => {
          routes.push({ key : index + "", id : index, index });
        });

        this.props.initializeNavigationState(routes);
        this.props.getDistrictList();
        this.props.getNeighbourHoodOfDistrict(this.props.choiceOwner.districtId);
      }
    }

    componentWillReceiveProps(nextProps) {

      if (!nextProps.flags.surveySaveInProgress && nextProps.flags.surveySaveCompleted) {
        this.props.navigation.goBack();
      }
    }
  
    render() {
      return (
        <Container style={{backgroundColor : "white"}}>
        <Header>
            <Left style={{flex: 20}}>
              <Button
                transparent
                onPress={() => {

                Alert.alert(
                  'Uyarı',
                  'Anketi kapatmak istediğinize emin misiniz ?',
                  [
                    {text: 'İptal', onPress: () => {}, style: 'cancel'},
                    {text: 'Evet', onPress: () => this.props.navigation.goBack()},
                  ],
                  { cancelable: false }
                )
              }}
              >
                <Icon active name="md-arrow-dropleft-circle" />
              </Button>              
            </Left>

            <Body style={{flex: 60}}>
              <Title>Anket Sihirbazı</Title>
            </Body>

            <Right style={{flex: 20}}>
            </Right>
        </Header>
        <View style={{flex: 1}}>
          <View style={{flex: 20, width: "90%", marginLeft : "5%"}}>
            <Card>
              <CardItem>
                  <Row>
                    <Col size={20}><Icon name="md-document" style={{fontSize: 32}}/></Col>
                    <Col size={80}>
                      <CustomText style={{fontSize : 18}}>{this.props.selectedSurvey.name}</CustomText>
                      <CustomText style={{marginTop : 5}}>{this.props.selectedSurvey.questions.length} soru</CustomText>
                    </Col>
                  </Row>
              </CardItem>
            </Card>
          </View>
          <View style={{flex: 70}}>
              {this._renderBody()}
          </View>
          {
            this.props.navigationState.showBottomButtons 
            ?
            <View style={{flex: 10, flexDirection : "row", paddingLeft : 8, paddingRight : 8}}>
                <Left>
                  <Button disabled={this.props.navigationState.backDisabled} onPress={this._showPreviousQuestion}><Icon name="md-arrow-back" /><CustomText>Önceki</CustomText></Button>
                </Left>
                <Right>
                  <Button disabled={this.props.navigationState.forwardDisabled} onPress={this._showNextQuestion}><CustomText>Sonraki</CustomText><Icon name="md-arrow-forward" /></Button>
                </Right>
            </View>
            :
            null
          }
        </View>
      </Container>
      );
    }

    _renderBody() {

      if (this.props.navigationState.surveyCompleted) {
        return (<Card>
          <CardItem>
              <View style={{flex: 1, alignItems : "center"}}>
                <Icon name="ios-checkmark-circle" style={{color : "green", width: 52, fontSize : 48}} />
                <CustomText>Anket tamamlandı</CustomText>
              </View>
          </CardItem>
          <CardItem>
              <View style={{flex: 1, alignItems : "center"}}>
                <Button block onPress={this._saveChoices} style={{backgroundColor : "green"}}><CustomText>Kaydet</CustomText></Button>
              </View>
          </CardItem>
        </Card>)
      }

      if (this.props.navigationState.showChoiceOwnerSetup) {

        let {districtList, activeNeighbourHoods} = this.props.district;
        let {districtId, neighbourhoodId, name} = this.props.choiceOwner;

        return <ChoiceOwnerForm districtList={districtList} 
                                neighbourHoods={activeNeighbourHoods} 
                                choiceOwnerName={name}
                                districtId={districtId}
                                neighbourhoodId={neighbourhoodId}
                                onNameChange={this._onNameChange}
                                onDistrictChange={this._onDistrictChange} 
                                onNeighbourHoodChange={this._onNeighbourHoodChange} 
                                onStartSurveyClicked={this._startSurvey} />  
      }

      return (<TabViewAnimated
                swipeEnabled={false}
                style={[styles.container, this.props.style]}
                navigationState={this.props.navigationState}
                renderScene={this._renderScene}
                onIndexChange={() => {}}
              />);
    }

    _renderScene = ({ route }) => {
      let {selectedSurvey, navigationState} = this.props;
      return (<SurveyQuestion
                survey={selectedSurvey}
                index={route.index}
                question={selectedSurvey.questions[route.index]}
                onChange={(choices) => {
                  this.props.updateChoices(choices);
                }}/>);
    };    

    _showNextQuestion = () => {
      this.props.showNextQuestion();
    }

    _showPreviousQuestion = () => {
      this.props.showPreviousQuestion();
    }

    _startSurvey = () => {
      this.props.startSurvey();
    }

    _saveChoices = () => {
      let {selectedSurvey, choiceOwner, flags, selectedDistrictInfo} = this.props;
      if (flags.editMode) {
        this.props.updateSavedChoices(selectedSurvey, choiceOwner, selectedDistrictInfo);
      } else {
        this.props.createChoices(selectedSurvey, choiceOwner);
      }
    }

    _onDistrictChange = (districtId) => {
      this.props.setSelectedDistrictOptions(districtId, null);
      this.props.getNeighbourHoodOfDistrict(districtId);
    }

    _onNeighbourHoodChange = (neighbourhoodId) => {
      let {districtId} = this.props.choiceOwner;
      this.props.setSelectedDistrictOptions(districtId, neighbourhoodId);
    }

    _onNameChange = (name) => {
      this.props.updateChoiceOwnerName(name);
    }
}

function bindAction(dispatch) {
  return {
    initializeNavigationState : routes => dispatch(initializeNavigationState(routes)),
    showPreviousQuestion : () => dispatch(showPreviousQuestion()),
    showNextQuestion : () => dispatch(showNextQuestion()),
    startSurvey : () => dispatch(startSurvey()),
    updateChoices : (choices) => dispatch(updateChoices(choices)),
    updateSavedChoices : (selectedSurvey, choiceOwner) => dispatch(updateSavedChoices(selectedSurvey, choiceOwner)),
    createChoices : (selectedSurvey, choiceOwner) => dispatch(createChoices(selectedSurvey, choiceOwner)),
    setSelectedDistrictOptions : (districtId, neighbourhoodId) => dispatch(setSelectedDistrictOptions(districtId, neighbourhoodId)),
    getDistrictList : () => dispatch(getDistrictList()),
    getNeighbourHoodOfDistrict : (districtId) => dispatch(getNeighbourHoodOfDistrict(districtId)),
    updateChoiceOwnerName : (name) => dispatch(updateChoiceOwnerName(name))
  };
}

const mapStateToProps = state => ({
  auth : state.auth, // TODO : find a better way to reach this in saga...
  selectedSurvey : state.survey.surveyWizard.selectedSurvey,
  selectedChoices : state.survey.surveyWizard.selectedChoices,
  navigationState : state.survey.surveyWizard.navigationState,
  flags : state.survey.surveyWizard.flags,
  choiceOwner : state.survey.surveyWizard.selectedChoiceOwner,
  selectedDistrictInfo : state.survey.surveyWizard.selectedDistrictInfo,
  district : state.district,
});

export default connect(mapStateToProps, bindAction)(SurveyWizard);

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    tabbar: {
      backgroundColor: '#222',
    },
    indicator: {
      backgroundColor: '#ffeb3b',
    },
  });