import { AsyncStorage } from "react-native";
import { delay } from "redux-saga";
import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects'

import { loginSuccess } from "../actions/auth";
import { 
    getSurveyList, 
    getSurveyListSuccess, 
    updateSurveyFlags,
    getCompletedSurveyListSuccess,
    getCompletedSurveyListLast5MinSuccess,
    createChoicesSuccess,
    processNextChoiceAction
} from "../actions/survey";
import {
    getDistrictListSuccess,
    getNeighbourHoodOfDistrictSuccess
} from "../actions/district";
import { 
    LOGIN_REQUEST, 
    LOGIN_REQUEST_SUCCESS,
    LOGOUT_REQUEST,
    SURVEY_LIST_REQUEST, 
    SURVEY_LIST_SUCCESS,
    CREATE_CHOICES, 
    CREATE_CHOICES_SUCCESS,
    EXECUTE_CREATE_CHOICES,
    UPDATE_SAVED_CHOICES,
    COMPLETED_SURVEY_LIST_REQUEST,
    COMPLETED_SURVEY_LIST_SUCCESS,
    APP_INITIALIZED,
    PROCESS_NEXT_CREATE_CHOICE,
    GET_DISTRICT_LIST_REQUEST,
    GET_NEIGHBOURHOOD_OF_DISTRICT_REQUEST,
    COMPLETED_SURVEY_LAST5MIN_LIST_REQUEST
} from "../actions/actionTypes";
import surveyApi from "./surveyApi";
import httpService from "../../services/HttpService";
import logService from "../../services/LogService";
import storageService from "../../services/StorageService";
import networkInfoService from "../../services/NetworkInfoService";
import request from "../../util/request";

// inject the dependency
surveyApi.setHttpService(httpService);
surveyApi.setLogService(logService);

const doLoginRequestSaga = function* doLoginRequestSaga({loginInfo}) {
    
    const loginRequestData = {
        ...loginInfo
    };

    try {
        let response = yield call(surveyApi.doLogin, loginRequestData);
        // TODO(tayfun) : move these statements to a different saga
        surveyApi.setToken(response.data.xAuthToken);
        surveyApi.saveAuthInfo(response.data.user, response.data.xAuthToken);
        yield put(loginSuccess(response.data.user, response.data.xAuthToken));
    } catch (err) {
        // TODO(tayfun) : handle error case...
        console.log(err);
    }
}

const handleAppInitialized = function* handleAppInitialized() {

    let authInfo = yield call(surveyApi.readAuthInfo);

    if (authInfo) {
        surveyApi.setToken(authInfo.token);
        yield put(loginSuccess(authInfo.user, authInfo.token));
    }

    // TODO(tayfun) : we can create a APP_INITIALIZATION_SUCCESS
    // event or smt else to start daemon in his own mechanism.
    // start choices processor daemon
    yield put(processNextChoiceAction());
}

const handleLogout = function* handleLogout() {
    yield call(surveyApi.clearAuthInfo);
}

const getSurveyListOfflineAwareSaga = function* getSurveyListOfflineAwareSaga() {

    if (networkInfoService.getIsConnected()) {
        yield call(getSurveyListSaga);
    } else {
        yield call(getSurveyListOfflineSaga);
    }
}

const getSurveyListSaga = function* getSurveyListSaga() {
    
    try {
        const response = yield call(surveyApi.getSurveyList);

        if (response.status == 'ok') {
            const surveyList = yield response.data;
            yield put(getSurveyListSuccess(surveyList));
        } else {
            // TODO(tayfun) : handle error case...
        }
    } catch (err) {
        // TODO(tayfun) : handle error case...
    }
}

const getSurveyListOfflineSaga = function* getSurveyListOfflineSaga() {
    const response = yield call(storageService.getSurveyListData);
    const surveyList = yield response.data;
    yield put(getSurveyListSuccess(surveyList));
}

const storeSurveyListOffline = function* storeSurveyListOffline({surveyList}) {
    yield call(storageService.saveSurveyListData, surveyList);
}

// ***** COMPLETED SURVEY LIST *******
const getCompletedSurveyListOfflineAwareSaga = function* getCompletedSurveyListOfflineAwareSaga() {

    if (networkInfoService.getIsConnected()) {
        yield call(getCompletedSurveyListSaga);
    } else {
        yield call(getCompletedSurveyListOfflineSaga);
    }
}

const getCompletedSurveyListSaga = function* getCompletedSurveyListSaga() {
    
    try {
        const response = yield call(surveyApi.getCompletedSurveyList);
        if(response.status == 'ok') {
            const completedSurveyList = yield response.data;
            yield put(getCompletedSurveyListSuccess(completedSurveyList));
        } else {
            // TODO(tayfun) : handle error case...
        }
    } catch (err) {
        // TODO(tayfun) : handle error case...
    }
}

const getCompletedSurveyListOfflineSaga = function* getCompletedSurveyListOfflineSaga() {
    const response = yield call(storageService.getCompletedSurveyListData);
    const completedSurveyList = yield response.data;
    yield put(getCompletedSurveyListSuccess(completedSurveyList));
}

const storeCompletedSurveyListOffline = function* storeCompletedSurveyListOffline({completedSurveyList}) {
    yield call(storageService.saveCompletedSurveyListData, completedSurveyList);
}

// ***** LAST 5 MIN COMPLETED SURVEY LIST ****
const getCompletedSurveyListLast5MinOfflineAwareSaga = function* getCompletedSurveyListLast5MinOfflineAwareSaga() {
    
    if (networkInfoService.getIsConnected()) {
        yield call(getCompletedSurveyListLast5MinSaga);
    } else {
        yield call(getCompletedSurveyListLast5MinOfflineSaga);
    }
}
    
const getCompletedSurveyListLast5MinSaga = function* getCompletedSurveyListLast5MinSaga() {
    
    try {
        const response = yield call(surveyApi.getCompletedSurveyListLast5Min);
        if(response.status == 'ok') {
            const completedSurveyList = yield response.data;
            yield put(getCompletedSurveyListLast5MinSuccess(completedSurveyList));
        } else {
            // TODO(tayfun) : handle error case...
        }
    } catch (err) {
        // TODO(tayfun) : handle error case...
    }
}
    
const getCompletedSurveyListLast5MinOfflineSaga = function* getCompletedSurveyListLast5MinOfflineSaga() {
    const response = yield call(storageService.getCompletedSurveyLast5MinListData);
    const completedSurveyList = yield response.data;
    yield put(getCompletedSurveyListLast5MinSuccess(completedSurveyList));
}

const storeCompletedSurveyListLast5MinOffline = function* storeCompletedSurveyListLast5MinOffline({completedSurveyList}) {
    yield call(storageService.saveCompletedSurveyLast5MinListData, completedSurveyList);
}


// **** CREATE CHOICES ******
const createChoicesSaga = function* createChoicesSaga({selectedSurvey, choiceOwner}) {

    let choicesData = {
        choiceOwnerName: choiceOwner.name,
        choiceOwnerAge: 0,
        choiceOwnerGender: 0,
        districtId: choiceOwner.districtId,
        neighbourhoodId: choiceOwner.neighbourhoodId,
        surveyId: selectedSurvey.surveyId,
        choiceROList : []
    };

    let {questions} = selectedSurvey;

    questions.forEach((question) => {

        if (question.type == 1) {

            let answer = question.answers[0];
            let {freeText} = answer;

            if (freeText) {
                choicesData.choiceROList.push({
                    "uid" : question.uid,
                    "status": 1,
                    "surveyId": selectedSurvey.surveyId,
                    "questionId": question.questionId,
                    "answerId": answer.answerId,
                    "freeText": freeText
                });
            }
        } else {
            question.answers.forEach((answer) => {
                if (answer.checked) {
                    choicesData.choiceROList.push({
                        "uid" : answer.uid,
                        "status": 1,
                        "surveyId": selectedSurvey.surveyId,
                        "questionId": question.questionId,
                        "answerId": answer.answerId          
                    });
                }
            });
        }
    });

    yield call(storageService.saveChoicesData, choicesData);
    yield put(updateSurveyFlags(false, true));
}

const runCreateChoicesSaga = function* runCreateChoicesSaga(choiceKey, choicesJsonData) {

    try {
        let response = yield call(surveyApi.createChoices, choicesJsonData);
        yield put(createChoicesSuccess(choiceKey));
    } catch (err) {
        // TODO(tayfun) : handle error case...
    }
}

const handleCreateChoicesSuccessSaga = function* handleCreateChoicesSuccessSaga({choiceKey}) {
    yield call(storageService.removeChoice, choiceKey);
}

const processNextCreateChoiceSaga = function* processNextCreateChoiceSaga() {

    if (networkInfoService.getIsConnected()) {

        const nextProcess = yield call(storageService.getNextChoiceToCreate);
        
        if (nextProcess) {
            const choiceData = yield call(storageService.getChoice, nextProcess.key);
            yield call(runCreateChoicesSaga, nextProcess.key, choiceData);
        }        
    }
    
    yield delay(5000);
    yield put(processNextChoiceAction());
}
// **** END OF CREATE CHOICES ******

const updateSavedChoicesSaga = function* updateSavedChoicesSaga({selectedSurvey, choiceOwner}) {
    
    let choicesData = {
        choiceOwnerName: choiceOwner.name,
        choiceOwnerId: choiceOwner.choiceOwnerId,
        choiceOwnerAge: 0,
        choiceOwnerGender: 0,
        districtId: choiceOwner.districtId,
        neighbourhoodId: choiceOwner.neighbourhoodId,        
        choiceROList : []
    };

    let {questions} = selectedSurvey;

    questions.forEach((question) => {

        if (question.type == 1) {

            let answer = question.answers[0];
            let {freeText} = answer;

            if (freeText) {
                choicesData.choiceROList.push({
                    "choiceId" : answer.choiceId,
                    "uid" : question.uid,
                    "status": 1,
                    "surveyId": selectedSurvey.surveyId,
                    "questionId": question.questionId,
                    "answerId": answer.answerId,
                    "freeText": freeText
                });
            }
        } else {
            question.answers.forEach((answer) => {
                if (answer.checked) {
                    choicesData.choiceROList.push({
                        "choiceId" : answer.choiceId,
                        "uid" : answer.uid,
                        "status": 1,
                        "surveyId": selectedSurvey.surveyId,
                        "questionId": question.questionId,
                        "answerId": answer.answerId          
                    });
                }
            });
        }
    });

    try {
        let response = yield call(surveyApi.updateSavedChoices, choicesData);
        yield put(updateSurveyFlags(false, true));
        yield call(getCompletedSurveyListSaga);
    } catch (err) {
        // TODO(tayfun) : handle error case...
    }
}

const getDistrictListSaga = function* getDistrictListSaga() {
    try {
        const response = yield call(surveyApi.getDistrictList);
        if (response.status == 'ok') {
            const districtList = yield response.data;
            yield put(getDistrictListSuccess(districtList));
        } else {
            // TODO(tayfun) : handle error case...
        }
    } catch (err) {
        console.log("loadDistrictListSaga err ->", err);
        // TODO(tayfun) : handle error case...
    }   
}

const getNeighbourhoodOfDistrictSaga = function* getNeighbourhoodOfDistrictSaga({districtId}) {
    try {
        console.log("getNeighbourhoodOfDistrictSaga districtId ->", districtId);
        const response = yield call(surveyApi.getNeighbourHoodForDistrict, districtId);
        if (response.status == 'ok') {
            const neighbourList = yield response.data;
            console.log("getNeighbourhoodOfDistrictSaga response ->", response);
            yield put(getNeighbourHoodOfDistrictSuccess(neighbourList));
        } else {
            // TODO(tayfun) : handle error case...
        }
    } catch (err) {
        console.log("loadDistrictListSaga err ->", err);
        // TODO(tayfun) : handle error case...
    }   
}

/**
 * Root saga manages watcher lifecycle
 */
const surveyAppSaga = function* surveyAppSaga() {
    yield takeLatest(LOGIN_REQUEST, doLoginRequestSaga);
    // survey list
    yield takeLatest(SURVEY_LIST_REQUEST, getSurveyListOfflineAwareSaga);
    yield takeLatest(SURVEY_LIST_SUCCESS, storeSurveyListOffline);
    // choice operations
    yield takeLatest(CREATE_CHOICES, createChoicesSaga);
    yield takeLatest(CREATE_CHOICES_SUCCESS, handleCreateChoicesSuccessSaga);
    yield takeLatest(PROCESS_NEXT_CREATE_CHOICE, processNextCreateChoiceSaga);

    // update saved choices...
    yield takeLatest(UPDATE_SAVED_CHOICES, updateSavedChoicesSaga);

    // completed survey list
    yield takeLatest(COMPLETED_SURVEY_LIST_REQUEST, getCompletedSurveyListOfflineAwareSaga);
    yield takeLatest(COMPLETED_SURVEY_LIST_SUCCESS, storeCompletedSurveyListOffline);   
    yield takeLatest(COMPLETED_SURVEY_LAST5MIN_LIST_REQUEST, getCompletedSurveyListLast5MinOfflineAwareSaga); 
    yield takeLatest(COMPLETED_SURVEY_LIST_SUCCESS, storeCompletedSurveyListLast5MinOffline);   

    // 
    yield takeLatest(APP_INITIALIZED, handleAppInitialized);
    yield takeLatest(LOGOUT_REQUEST, handleLogout);

    //
    yield takeLatest(GET_DISTRICT_LIST_REQUEST, getDistrictListSaga);
    yield takeLatest(GET_NEIGHBOURHOOD_OF_DISTRICT_REQUEST, getNeighbourhoodOfDistrictSaga)
}

export default surveyAppSaga;