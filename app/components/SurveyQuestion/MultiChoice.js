/* @flow */

import React, { PureComponent} from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Container, 
    Header, 
    Content, 
    List, 
    ListItem, 
    Text, 
    Left, 
    Radio
} from "native-base";
import { CheckBox } from 'react-native-elements'

export default class MultiChoice extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (<List style={styles.matchParent}>
                    {this.props.answers.map((answer, index) => {
                        return (<ListItem key={index} style={styles.listItem}>
                                    <CheckBox checked={answer.checked} 
                                                checkedIcon='dot-circle-o'
                                                uncheckedIcon='circle-o' 
                                                textStyle={{fontSize : 16}}
                                                style={styles.radioInput} 
                                                title={answer.text}
                                                onPress={() => this.onRadioPressed(answer, index)} />
                                </ListItem>)
                    })}
                </List>);
    } 

    onRadioPressed(answer, index) {
        this.props.onChange(answer, index);
    }
}

const styles = {
    matchParent : {
        flex: 1
    },
    listItem : {
        marginLeft : 0
    },
    radioInput : { 
        marginRight: 8
    }
}
