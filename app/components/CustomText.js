import React from "react";
import {Text} from "native-base";

export const CustomText = ({style, children}) => {
    let pStyle = style || {};
    let fontSize = pStyle.fontSize ? pStyle.fontSize : 16;
    return <Text style={{...pStyle, fontSize}}>{children}</Text>
};