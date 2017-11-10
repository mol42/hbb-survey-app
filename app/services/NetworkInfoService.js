import { NetInfo } from "react-native";

class NetworkInfoService {

    isConnected = false;

    initialize() {

        NetInfo.getConnectionInfo().then((connectionInfo) => {
            this.isConnected = connectionInfo.type != "none";
        });
          
        NetInfo.addEventListener( 'connectionChange', (connectionInfo) => this.handleFirstConnectivityChange(connectionInfo));
    }
    
    handleFirstConnectivityChange(connectionInfo) {
        this.isConnected = connectionInfo.type != "none";
    }

    getIsConnected() {
        return this.isConnected;
    }
}

export default new NetworkInfoService();