/* @flow */

import React, { PureComponent} from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Button,
    Text,
    Card,
    CardItem,
    Input
} from "native-base";

export default class TextAnswer extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return <Input style={styles.textInput} multiline={true} value={this.props.value} onChange={(event) => this.props.onChange(event.nativeEvent.text)} />
    } 
}

const styles = {
    textInput : {
        padding : 5, 
        width : "100%", 
        height : 75, 
        borderWidth : 1, 
        borderColor : "#eee"
    }
}
