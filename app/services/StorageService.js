import { AsyncStorage } from "react-native";

const CREATE_CHOICE_KEY_PREFIX = "CREATE_CHOICE@";
const KEY_LENGTH = CREATE_CHOICE_KEY_PREFIX.length;

const SURVEY_LIST_DATA_KEY = "SURVEY_LIST_DATA";
const COMPLETED_SURVEY_LIST_DATA_KEY = "COMPLETED_SURVEY_LIST_DATA";
const COMPLETED_SURVEY_LAST5MIN_LIST_DATA_KEY = "COMPLETED_SURVEY_LAST5MIN_LIST_DATA_KEY";

class StorageService {

    generateTimeStamp() {
        return new Date().getTime();
    }

    saveChoicesData(choicesData) {

        return new Promise((resolve, reject) => {
            const key = CREATE_CHOICE_KEY_PREFIX + new Date().getTime();

            AsyncStorage.setItem(key, JSON.stringify(choicesData))
                .then(() => {
                    resolve();
                });
        });  
    }  
    
    getNextChoiceToCreate() {
        return new Promise((resolve, reject) => {
            
            AsyncStorage.getAllKeys()
                .then((keyList) => {
                    let choicesToProcessList = [];

                    for (let i = 0; i < keyList.length; i++) {
                        let keyName = keyList[i];

                        if (keyName.indexOf(CREATE_CHOICE_KEY_PREFIX) == 0) {
                            choicesToProcessList.push({
                                key : keyList[i],
                                time : keyName.substr(KEY_LENGTH, (keyName.length - KEY_LENGTH))
                            });
                        }
                    }

                    choicesToProcessList.sort((info1, info2) => {
                        return info1.time > info2.time ? 1 : -1;
                    });
                    
                    let choiceToProcess = null;
                    if (choicesToProcessList.length > 0) {
                        choiceToProcess = choicesToProcessList[0];
                    }
                    resolve(choiceToProcess);
                });
        }); 
    }

    // get choice object from DB
    getChoice(choiceKey) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(choiceKey)
                .then((choiceData) => {
                    resolve(JSON.parse(choiceData));
                });
        });
    }

    // remove processed choice from DB (survey is sent to server-side...)
    removeChoice(choiceKey) {
        return new Promise((resolve, reject) => {
            AsyncStorage.removeItem(choiceKey)
                .then(() => {
                    resolve();
                }) 
        });
    }

    saveSurveyListData(surveyList) {

        return new Promise((resolve, reject) => {

            AsyncStorage.setItem(SURVEY_LIST_DATA_KEY, JSON.stringify(surveyList))
                .then(() => {
                    resolve();
                });
        });        
    }

    getSurveyListData() {
        return new Promise((resolve, reject) => {

            AsyncStorage.getItem(SURVEY_LIST_DATA_KEY)
                .then((surveyListData) => {

                    if (!surveyListData) {
                        resolve({
                            status : "ok",
                            data : []
                        });
                    }

                    let surveyList = JSON.parse(surveyListData);
                    resolve({
                        status : "ok",
                        data : surveyList
                    });
                });
        });        
    }

    saveCompletedSurveyListData(completedSurveyList) {

        return new Promise((resolve, reject) => {

            AsyncStorage.setItem(COMPLETED_SURVEY_LIST_DATA_KEY, JSON.stringify(completedSurveyList))
                .then(() => {
                    resolve();
                });
        });       
    }

    getCompletedSurveyListData() {

        return new Promise((resolve, reject) => {

            AsyncStorage.getItem(COMPLETED_SURVEY_LIST_DATA_KEY)
                .then((completedSurveyListData) => {
                    
                    if (!completedSurveyListData) {
                        resolve({
                            status : "ok",
                            data : []
                        });
                    }

                    let completedSurveyList = JSON.parse(completedSurveyListData);
                    resolve({
                        status : "ok",
                        data : completedSurveyList
                    });
                });
        });         
    }

    saveCompletedSurveyLast5MinListData(completedSurveyList) {
        
        return new Promise((resolve, reject) => {

            AsyncStorage.setItem(COMPLETED_SURVEY_LAST5MIN_LIST_DATA_KEY, JSON.stringify(completedSurveyList))
                .then(() => {
                    resolve();
                });
        });       
    }
        
    getCompletedSurveyLast5MinListData() {

        return new Promise((resolve, reject) => {

            AsyncStorage.getItem(COMPLETED_SURVEY_LAST5MIN_LIST_DATA_KEY)
                .then((completedSurveyListData) => {
                    
                    if (!completedSurveyListData) {
                        resolve({
                            status : "ok",
                            data : []
                        });
                    }

                    let completedSurveyList = JSON.parse(completedSurveyListData);
                    resolve({
                        status : "ok",
                        data : completedSurveyList
                    });
                });
        });         
    }
}

export default new StorageService();