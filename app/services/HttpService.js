import Config from "react-native-config";
import shortid from "shortid";

class HttpService {

    fetch(requestOptions) {

        return new Promise((resolve, reject) => {

            const logService = this.logService;
            const {sendToken} = requestOptions;
            const requestId = shortid.generate();
            const url = this.configureUrl(requestOptions);
            const overriddenHeaders = requestOptions.headers || {};
            const reqLogOptions = requestOptions.logOptions || {};
            
            const logOptions = {
                enabled : reqLogOptions.enabled === false ? false : true,
                logRequest : reqLogOptions.logRequest === false ? false : true,
                logResponse : reqLogOptions.logResponse === false ? false : true
            };

            const processedRequestOptions = {
                ...requestOptions,
                body : JSON.stringify(requestOptions.body),
                headers : {
                    "Content-Type" : "application/json",
                    "x-auth-token" : (typeof sendToken === "undefined" ? this.token : (sendToken === false ? null : this.token)),
                    ...overriddenHeaders
                },
                timeout: Config.HTTP_TIMEOUT_MS
            };

            // TODO(tayfun): find a way to remove this logic to a side-effect...
            if (logService && logOptions.enabled && logOptions.logRequest) {
                logService.sendLog({id : requestId, type : "request", options : processedRequestOptions});
            }
            
            fetch(url, processedRequestOptions)
                .then(res => res.json()) // convert text response to json object
                .then(res => {
                    if (logService && logOptions.enabled && logOptions.logResponse) {
                        logService.sendLog({id : requestId, type : "response", data : res});
                    }
                    resolve(res);
                })
                .catch((err) => {
                    if (logService && logOptions.enabled && logOptions.logError) {
                        logService.sendLog({id : requestId, type : "error", data : err});
                    }
                    // handle error conditions here...
                    reject({
                        status : "error"
                    });
                });
        });
    }

    configureUrl(requestOptions) {
        let url = requestOptions.apiPath || Config.API_URL;
        url = requestOptions.path ? (url + requestOptions.path) : url;
        return url;
    }

    setToken(token) {
        this.token = token;
    }

    setLogService(logService) {
        this.logService = logService;
    }
}

export default new HttpService();