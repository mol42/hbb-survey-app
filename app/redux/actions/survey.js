
import type { Action } from './types';

import {
  SURVEY_LIST_REQUEST,
  SURVEY_LIST_SUCCESS,
  SHOW_PREVIOUS_QUESTION,
  SHOW_NEXT_QUESTION,
  SET_SELECTED_SURVEY,
  INITIALIZE_NAVIGATION_STATE,
  UPDATE_CHOICES,
  CREATE_CHOICES,
  CREATE_CHOICES_SUCCESS,
  PROCESS_NEXT_CREATE_CHOICE,
  UPDATE_SAVED_CHOICES,
  UPDATE_SURVEY_FLAGS,
  COMPLETED_SURVEY_LIST_REQUEST,
  COMPLETED_SURVEY_LIST_SUCCESS,
  COMPLETED_SURVEY_LAST5MIN_LIST_REQUEST,
  COMPLETED_SURVEY_LAST5MIN_LIST_SUCCESS,
  SET_SELECTED_COMPLETED_SURVEY,
  FILTER_SURVEY_LIST,
  START_SURVEY,
  SET_SELECTED_DISTRICT_OPTIONS,
  UPDATE_CHOICE_OWNER_NAME
} from "./actionTypes";

export function getSurveyList() {
  return {
    type : SURVEY_LIST_REQUEST
  }
}

export function getSurveyListSuccess(surveyList) {
  return {
    type : SURVEY_LIST_SUCCESS,
    surveyList
  }
}

export function setSelectedSurvey(survey) {
  return {
    type : SET_SELECTED_SURVEY,
    survey
  }
}

export function filterSurveyList(newText) {
  return {
    type : FILTER_SURVEY_LIST,
    newText
  }  
}

export function showPreviousQuestion() {
  return {
    type : SHOW_PREVIOUS_QUESTION
  }  
}

export function showNextQuestion() {
  return {
    type : SHOW_NEXT_QUESTION
  }  
}

export function startSurvey() {
  return {
    type : START_SURVEY
  }  
}

export function initializeNavigationState(routes) {
  return {
    type : INITIALIZE_NAVIGATION_STATE,
    routes
  }
}

export function updateChoices({question, answer, index, answerText}) {
  return {
    type : UPDATE_CHOICES,
    question, 
    answer, 
    index, 
    answerText
  }  
}

export function createChoices(selectedSurvey, choiceOwner) {
  return {
    type : CREATE_CHOICES,
    selectedSurvey,
    choiceOwner
  }  
}

export function createChoicesSuccess(choiceKey) {
  return {
    type : CREATE_CHOICES_SUCCESS,
    choiceKey
  }  
}

export function updateSavedChoices(selectedSurvey, choiceOwner) {
  return {
    type : UPDATE_SAVED_CHOICES,
    selectedSurvey,
    choiceOwner
  }  
}

export function updateSurveyFlags(surveySaveInProgress, surveySaveCompleted) {
  return {
    type : UPDATE_SURVEY_FLAGS,
    surveySaveInProgress,
    surveySaveCompleted
  } 
}

export function setCompletedSurveyAndChoiceList(choiceOwnerId) {
  return {
    type : SET_SELECTED_COMPLETED_SURVEY,
    choiceOwnerId
  }
}

export function getCompletedSurveyList() {
  return {
    type : COMPLETED_SURVEY_LIST_REQUEST
  }
}

export function getCompletedSurveyListSuccess(completedSurveyList) {
  return {
    type : COMPLETED_SURVEY_LIST_SUCCESS,
    completedSurveyList
  }
}

export function getCompletedSurveyListLast5Min() {
  return {
    type : COMPLETED_SURVEY_LAST5MIN_LIST_REQUEST
  }
}

export function getCompletedSurveyListLast5MinSuccess(completedSurveyList) {
  return {
    type : COMPLETED_SURVEY_LAST5MIN_LIST_SUCCESS,
    completedSurveyList
  }
}

export function processNextChoiceAction() {
  return {
    type : PROCESS_NEXT_CREATE_CHOICE
  }
}

export function setSelectedDistrictOptions(districtId, neighbourhoodId) {
  return {
    type : SET_SELECTED_DISTRICT_OPTIONS,
    districtId, 
    neighbourhoodId
  }
}

export function updateChoiceOwnerName(name) {
  return {
    type : UPDATE_CHOICE_OWNER_NAME,
    name
  }
}
