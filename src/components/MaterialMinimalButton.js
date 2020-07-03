import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

import { colors } from '../common/theme';

function MaterialMinimalButton(props) {

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={() => { props.onPress() }}
        >
            <Text style={styles.caption}>{props.caption}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '50%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        backgroundColor: colors.WHITE,
    },
    caption: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.PRIMARY_COLOR,
    },
});

export default MaterialMinimalButton;
