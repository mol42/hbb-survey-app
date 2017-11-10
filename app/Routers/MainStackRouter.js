import React, { Component } from "react";
import Login from "../containers/login/";
import Home from "../containers/home/";
import SurveyList from "../containers/surveyList";
import SurveyWizard from "../containers/surveyWizard";
import CompletedSurveyList from "../containers/completedSurveyList";
import Last5MinCompletedSurveyList from "../containers/last5MinCompletedSurveyList";
import { StackNavigator } from "react-navigation";
import { Header, Left, Button, Icon, Body, Title, Right } from "native-base";

export default (StackNav = StackNavigator({
  Login: { screen: Login },
  Home: { screen: Home },
  SurveyList : { screen : SurveyList },
  SurveyWizard : { screen : SurveyWizard },
  CompletedSurveyList : { screen : CompletedSurveyList},
  Last5MinCompletedSurveyList : { screen : Last5MinCompletedSurveyList }
}));
