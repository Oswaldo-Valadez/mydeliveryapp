import React, { useState } from 'react';

import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text
} from 'react-native';

import { colors } from '../common/theme';

import I18n from '../common/lang/config';

import * as Icon from '@expo/vector-icons';

export default function ServiceTypes(props) {

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.typeButton} onPress={() => {
                props.onPress ?
                    props.onPress('car', !props.services.car)
                    : null
            }}>
                <Icon.FontAwesome name="car" color={props.services.car ? colors.PRIMARY_COLOR : colors.TRANSPARENCY.BLACK.medium} size={32} />
                <Text style={styles.caption}>{I18n.t('car')}</Text>
                {
                    props.withPricing ?
                        <Text style={styles.caption}>{I18n.t('omr_car')}</Text>
                        :
                        null
                }
            </TouchableOpacity>

            <TouchableOpacity style={styles.typeButton} onPress={() => {
                props.onPress ?
                    props.onPress('bus', !props.services.bus)
                    : null
            }}>
                <Icon.FontAwesome name="bus" color={props.services.bus ? colors.PRIMARY_COLOR : colors.TRANSPARENCY.BLACK.medium} size={32} />
                <Text style={styles.caption}>{I18n.t('bus')}</Text>
                {
                    props.withPricing ?
                        <Text style={styles.caption}>{I18n.t('omr_bus')}</Text>
                        :
                        null
                }
            </TouchableOpacity>

            <TouchableOpacity style={styles.typeButton} onPress={() => {
                props.onPress ?
                    props.onPress('pickup', !props.services.pickup)
                    : null
            }}>
                <Icon.MaterialCommunityIcons name="car-pickup" color={props.services.pickup ? colors.PRIMARY_COLOR : colors.TRANSPARENCY.BLACK.medium} size={32} />
                <Text style={styles.caption}>{I18n.t('pickup')}</Text>
                {
                    props.withPricing ?
                        <Text style={styles.caption}>{I18n.t('omr_pickup')}</Text>
                        :
                        null
                }
            </TouchableOpacity>

            <TouchableOpacity style={styles.typeButton} onPress={() => {
                props.onPress ?
                    props.onPress('truck', !props.services.truck)
                    : null
            }}>
                <Icon.MaterialCommunityIcons name="truck" color={props.services.truck ? colors.PRIMARY_COLOR : colors.TRANSPARENCY.BLACK.medium} size={32} />
                <Text style={styles.caption}>{I18n.t('truck')}</Text>
                {
                    props.withPricing ?
                        <Text style={styles.caption}>{I18n.t('omr_truck')}</Text>
                        :
                        null
                }
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    typeButton: {
        flex: 1,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.TRANSPARENCY.BLACK.small,
        borderRadius: 8,
        padding: 8,
        margin: 8
    },
    caption: {
        fontSize: 8,
        color: colors.TRANSPARENCY.BLACK.medium
    },
    container: {
        flexDirection: 'row',
    },
});