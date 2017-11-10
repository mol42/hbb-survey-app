import { AsyncStorage } from "react-native";
import Config from 'react-native-config';

class SurveyApi {
    
    token = "";

    setToken = (token) => {
        this.token = token;
        if (this.httpService) {
            this.httpService.setToken(token);
        }
    }

    getToken = () => {
        return this.token;
    }

    setHttpService = (httpService) => {
        this.httpService = httpService;
    }

    setLogService = (logger) => {
        if (this.httpService) {
            this.httpService.setLogService(logger);
        }
    }

    getApiHost = () => {
        return Config.API_URL;
    }

    doLogin = (userData) => {

        return this.httpService.fetch({
            path : "/auth/login",
            method: "POST",
            body : userData,
            sendToken : false
        });
    }

    createChoices = (choicesData) => {

        return this.httpService.fetch({
            path : "/survey/create/choice",
            method: "POST",
            body : choicesData
        });       
    }

    updateSavedChoices = (choicesData) => {

        return this.httpService.fetch({
            path : "/survey/update/choice",
            method: "POST",
            body : choicesData
        });
    }

    getSurveyList = () => {

        return this.httpService.fetch({
            path : "/survey/list/survey/1",
            method: "GET"
        });   
    }

    getCompletedSurveyListLast5Min = () => {

        return this.httpService.fetch({
            path : "/survey/list/choiceOwner/last5min",
            method: "GET"
        });
    }

    getCompletedSurveyList = () => {
        
        return this.httpService.fetch({
            path : "/survey/list/choiceOwner",
            method: "GET"
        });
    }

    getDistrictList = () => {

        return this.httpService.fetch({
            path : "/survey/list/district",
            method: "GET"
        });
    }

    getNeighbourHoodForDistrict = (districtId) => {

        return this.httpService.fetch({
            path : `/survey/list/neighbourhood/${districtId}`,
            method: "GET"
        });
    }

    readAuthInfo = () => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem("AUTH_INFO", (err, authInfoStr) => {
                if (authInfoStr) {
                    let authInfo = JSON.parse(authInfoStr);
                    resolve(authInfo);
                }else {
                    resolve(null);
                }
            });
        }); 
    }

    saveAuthInfo = (user, token) => {
        try {
            AsyncStorage.setItem("AUTH_INFO", JSON.stringify({
                user,
                token
            }));
        } catch(e) {
            console.log("saveAuthInfo e ->", e);
        }
    }

    clearAuthInfo = () => {
        return new Promise((resolve, reject) => {
            AsyncStorage.removeItem("AUTH_INFO");
            resolve();
        });
    }
}
     
export default new SurveyApi();