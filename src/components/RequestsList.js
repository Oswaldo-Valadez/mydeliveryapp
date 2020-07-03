import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    AsyncStorage,
    Dimensions
} from 'react-native';
import { Surface } from 'react-native-paper';
import { colors } from '../common/theme';
import I18n from '../common/lang/config';

const { height } = Dimensions.get('window');

export default function RequestItemList(props) {
    return (
        <Surface style={styles.container}>
            <TouchableOpacity style={{ width: '100%', height: '100%' }}>
                <View>
                    <Text style={styles.code}>Request #AJD73AI3AU37</Text>
                    <Text style={styles.date}>Thu May 28 2020</Text>
                </View>
                <View>
                    <Text style={styles.date}>Truck</Text>
                </View>
                <View>
                    <Text style={{ justifyContent: 'center', fontWeight: '100' }}>A peep at some distant orb has power to raise and purify our thoughts like a strain of sacred music, or a noble picture, or a passage from the grander poets. It always does one good. @oswaldo.valadez. LOREM DOLOR SIT AMET. {props.id}</Text>
                </View>
            </TouchableOpacity>
        </Surface>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '96%',
        height: height * 0.3,
        alignSelf: 'center',
        marginVertical: 6,
        padding: 10,
        elevation: 4,
        borderRadius: 10,
    },
    date: {
        fontWeight: 'bold',
        fontSize: 16,
        alignSelf: 'flex-end',
    },
    code: {
        fontWeight: 'bold',
        fontSize: 18,
        color: colors.PRIMARY_COLOR,
    }
});