/* @flow */

import React, { PureComponent} from 'react';
import { View, StyleSheet, Picker, TextInput } from 'react-native';
import {
    Container, 
    Header, 
    Content, 
    List, 
    ListItem, 
    Text, 
    Left, 
    Radio,
    Form,
    Card,
    CardItem,
    Button,
    Row
} from "native-base";
import { CustomText } from "../../components/CustomText";
import { CheckBox } from 'react-native-elements'

const styles = {
    cardItem : {
        paddingTop : 2,
        paddingBottom : 2
    }
}

export default class ChoiceOwnerForm extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (<Card>
            <CardItem style={{justifyContent : "center"}}>
                <CustomText style={{fontWeight : "bold"}}>Genel Bilgiler</CustomText>
            </CardItem>
            <CardItem style={styles.cardItem}>
                <CustomText>İsim :</CustomText>
            </CardItem>
            <CardItem style={styles.cardItem}>
                <TextInput style={{width: "100%", fontSize : 16, padding : 5, marginLeft: 5, borderWidth : 1, borderColor : "#eee"}} value={this.props.choiceOwnerName} onChangeText={this.props.onNameChange} />
            </CardItem>
            <CardItem style={styles.cardItem}>
                <Picker
                    style={{width: "100%", height: 44}} itemStyle={{height: 44}}
                    selectedValue={this.props.districtId}
                    onValueChange={(itemValue, itemIndex) => this.props.onDistrictChange(itemValue)}>
                    <Picker.Item label="İlçeyi Seçiniz" value={-1} key={"distrcit_00"} />
                    {this.props.districtList.map((district) => {
                        return <Picker.Item label={district.name} value={district.districtId} key={"distrcit" + district.districtId} />
                    })}
                </Picker>
            </CardItem>
            <CardItem style={styles.cardItem}>
                <Picker
                    style={{width: "100%", height: 44}} itemStyle={{height: 44}}
                    selectedValue={this.props.neighbourhoodId}
                    onValueChange={(itemValue, itemIndex) => this.props.onNeighbourHoodChange(itemValue)}>
                    <Picker.Item label="Mahalleyi Seçiniz" value={-1} key={"neighbourHood_00"} />
                    {this.props.neighbourHoods.map((neighbourHood) => {
                        return <Picker.Item label={neighbourHood.name} value={neighbourHood.neighbourhoodId} key={"neighbourHood_" + neighbourHood.neighbourhoodId} />
                    })}
                </Picker>
            </CardItem>
            <CardItem>
                <View style={{flex: 1, alignItems : "center"}}>
                    <Button block onPress={this.props.onStartSurveyClicked} style={{backgroundColor : "green"}}><CustomText>Anketi Başlat</CustomText></Button>
                </View>
            </CardItem>
          </Card>);
    } 

}