import httpService from "./HttpService";
import Config from "react-native-config";
import moment from "moment";
import { stringify } from "circular-json-es6";

// curl -H "content-type:text/plain" -d '{ "message" : "hello" }' http://logs-01.loggly.com/inputs/XXXX/tag/http/
class LogService {
    
    sendLog = (data) => {
        const environment = Config.ENVIRONMENT;
        // do not log at DEV mode.
        if (__DEV__ || !Config.LOGGLY_ENDPOINT) {
            return;
        }
        const logData = {
            environment,
            data,
            timestamp : moment().format()
        };
        httpService.fetch({
            apiPath : Config.LOGGLY_ENDPOINT,
            method: "POST",
            headers : {
                "content-type" : "text/plain"
            },
            sendToken : false,
            logOptions : {
                enabled : false
            },
            body : stringify(logData)
        });
    }

}

export default new LogService();