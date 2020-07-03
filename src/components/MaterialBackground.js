import React from "react";
import { ImageBackground, View, StyleSheet } from "react-native";

import { colors } from '../common/theme';

export default function MaterialBackground(props) {
    return (
        <ImageBackground style={styles.image} source={props.source}>
            <View style={styles.container}>
                {props.children}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    image: {
        flex: 1,
        resizeMode: "cover",
    },
});