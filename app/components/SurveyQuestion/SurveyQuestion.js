/* @flow */

import React, { PureComponent} from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Button,
    Text,
    Card,
    CardItem
} from "native-base";
import { CustomText } from "../../components/CustomText";
import TextAnswer from "./TextAnswer";
import MultiChoice from "./MultiChoice";

export default class SurveyQuestion extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        let {question, index} = this.props;
        let actualQuestion = question.mandatory ?  question.text + " (zorunlu)" : question.text;

        return (<Card>
            <CardItem>
                <CustomText style={{fontSize: 18}}>{index+1} : {actualQuestion}</CustomText>
            </CardItem>
            <CardItem>
                {this._renderAnswerList()}
            </CardItem>
        </Card>)
    }

    _renderAnswerList() {
        let {question} = this.props;
        let {type, answers} = question;

        if (type == 1) {
            return <TextAnswer value={answers[0].freeText} 
                                onChange={(answerText) => {
                                    this.props.onChange({
                                        question,
                                        answerText
                                    });
                                }}/>
        }
        return <MultiChoice multi={type == 2 ? false : true} 
                            answers={answers}
                            onChange={(answer, index) => {
                                this.props.onChange({
                                    question, 
                                    answer,
                                    index
                                });
                            }}/>
    }
    
}
