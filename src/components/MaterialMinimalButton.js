import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    StatusBar,
    Platform
} from "react-native";

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
        borderTopLeftRadius: Platform.OS == 'ios' ? 25 : 0,
        borderTopRightRadius: Platform.OS == 'ios' ? 25 : 0,
        backgroundColor: colors.WHITE.default,
        marginTop: Platform.OS == 'ios' ? StatusBar.currentHeight + 4 : 0,
    },
    caption: {
        fontSize: 14,
        color: colors.PRIMARY_COLOR,
        fontFamily: 'OpenSans-Bold',
    },
});

export default MaterialMinimalButton;
