import React from 'react';

import { colors } from '../common/theme';

import {
    View,
    Modal,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import * as Icon from '@expo/vector-icons';

import BottomButton from '../components/BottomButton';

var { width, height } = Dimensions.get('window');

export default function MyModal(props) {
    return (
        <Modal
            visible={props.isVisible}
            animationType="none"
            transparent={true}
            onRequestClose={props.onRequestClose}
        >
            <View style={styles.container}>
                <View style={[styles.innerContainer, props.large ? { height: (height * 0.8) } : { height: (height * 0.4) }]}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{props.headerCaption}</Text>
                        <TouchableOpacity style={styles.icon} onPress={props.onRequestClose}>
                            <Icon.MaterialIcons
                                name="close"
                                color={colors.TRANSPARENCY.BLACK.medium}
                                backgroundColor={colors.TRANSPARENT}
                                size={32}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.body}>
                        {props.children}
                    </View>
                    {
                        props.action ?
                            <View style={styles.footer}>
                                <BottomButton caption={props.actionCaption} onPress={props.action} />
                            </View>
                            :
                            null
                    }
                </View>

            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    icon: {
        flex: 1,
        flexDirection: 'row',
        textAlign: 'right',
        paddingTop: 2,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.TRANSPARENCY.BLACK.medium,
    },
    innerContainer: {
        width: (width * 0.90),
        backgroundColor: colors.WHITE.default,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        elevation: 8,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        height: 60,
        borderBottomWidth: 1,
        borderColor: colors.TRANSPARENCY.BLACK.small,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 18
    },
    headerText: {
        flex: 2,
        flexDirection: 'row',
        color: colors.BLACK,
        fontSize: 24,
        fontWeight: 'bold',
    },
    footer: {
        width: '100%',
        height: 50,
        backgroundColor: colors.PRIMARY_COLOR,
    },
    footerText: {
        color: colors.WHITE.default,
        fontSize: 24,
        fontWeight: 'bold',
    },
    body: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 18,
    },
    bodyText: {
        color: colors.WHITE.default,
        fontSize: 24,
        fontWeight: 'bold',
    }
});