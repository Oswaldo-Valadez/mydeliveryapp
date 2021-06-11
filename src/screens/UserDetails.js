import React, { useState, useEffect, useContext } from 'react';

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from 'react-native';

import {
    Surface
} from 'react-native-paper';

import { colors } from '../common/theme';
import I18n from '../common/lang/config';

import * as firebase from 'firebase';

import * as Icon from '@expo/vector-icons';

import { AuthContext } from '../common/context';

import ServiceTypes from '../components/ServiceTypes';

const { width, height } = Dimensions.get('window');

export default function UserDetails(props) {
    const { useIsLang, usertype } = useContext(AuthContext);

    useEffect(() => {
        const user = firebase.database().ref('users/' + firebase.auth().currentUser.uid);

        user.on('value', data => {
            if (data.val()) {
                const user_data = data.val();

                if (usertype == 'provider') {
                    setUserData({
                        username: user_data.username,
                        full_name: user_data.full_name,
                        email: user_data.email,
                        phone: user_data.phone,
                        services: {
                            bus: user_data.services.bus,
                            car: user_data.services.car,
                            pickup: user_data.services.pickup,
                            truck: user_data.services.truck
                        },
                        approved: user_data.approved
                    });
                } else {
                    setUserData({
                        ...userData,
                        username: user_data.username,
                        full_name: user_data.full_name,
                        email: user_data.email,
                        phone: user_data.phone,
                    });
                }
            }
        });

    }, []);

    const [userData, setUserData] = useState({
        username: '',
        full_name: '',
        email: '',
        phone: '',
        services: {
            bus: false,
            car: false,
            pickup: false,
            truck: false,
        },
        approved: false,
    });

    return (
        <View style={styles.container}>
            <ScrollView>
                <Surface style={[styles.surface, { padding: 32, marginTop: 0, marginBottom: 32, paddingBottom: 40 }]}>
                    <Icon.FontAwesome style={{ flex: 1, textAlign: 'center', textAlignVertical: 'center' }} name="user-circle" color={colors.PRIMARY_COLOR} size={96} />
                    <Surface style={styles.username}>
                        <Text style={{ flex: 1, color: colors.WHITE.default, fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center' }}>
                            @{userData.username}
                        </Text>
                    </Surface>
                    {
                        usertype == 'provider' ?
                            <TouchableOpacity style={styles.membership} onPress={() => props.navigation.navigate('ProviderMakePaymentScreen')}>
                                <Icon.FontAwesome name={userData.approved ? 'bookmark' : 'bookmark-o'} color={colors.PRIMARY_COLOR} size={32} />
                            </TouchableOpacity>
                            :
                            null
                    }
                </Surface>

                <Surface style={styles.surface}>
                    <View style={styles.action}>
                        <Text style={styles.inputText}>{userData.full_name}</Text>
                        <Icon.FontAwesome style={{ marginLeft: 8 }} name="user-o" color={colors.PRIMARY_COLOR} size={20} />
                    </View>
                    <View style={styles.action}>
                        <Text style={styles.inputText}>{userData.email}</Text>
                        <Icon.FontAwesome style={{ marginLeft: 8 }} name="envelope-o" color={colors.PRIMARY_COLOR} size={20} />
                    </View>
                    <View style={styles.action}>
                        <Text style={[styles.inputText, { fontWeight: 'bold' }]}>{userData.phone}</Text>
                        <Icon.FontAwesome style={{ marginLeft: 4 }} name="phone" color={colors.PRIMARY_COLOR} size={20} />
                    </View>
                </Surface>
                {
                    usertype == 'provider' ?
                        <TouchableOpacity onPress={() => props.navigation.navigate('ProviderMakePaymentScreen')}>
                            <Surface style={styles.surface}>
                                <ServiceTypes services={userData.services} />
                            </Surface>
                        </TouchableOpacity>
                        : null
                }
                <Surface style={styles.surface}>
                    <TouchableOpacity style={styles.action} onPress={() => useIsLang(false)}>
                        <Text style={styles.inputText}>{I18n.t('language')}</Text>
                        <Icon.MaterialCommunityIcons style={{ marginLeft: 8 }} name="translate" color={colors.PRIMARY_COLOR} size={20} />
                    </TouchableOpacity>
                </Surface>
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE.background,
    },
    username: {
        backgroundColor: colors.PRIMARY_COLOR,
        elevation: 6,
        height: 40,
        width: width * 0.7,
        borderRadius: 100,
        position: 'absolute',
        bottom: -20,
        left: (width / 2) - (width * 0.35),
    },
    membership: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 10
    },
    surface: {
        width: '100%',
        alignSelf: 'center',
        marginVertical: 6,
        padding: 12,
        elevation: 1,
        borderRadius: 0,
        overflow: "visible",
        backgroundColor: colors.WHITE.default
    },
    title: {
        marginLeft: 4,
        fontWeight: 'bold',
        fontSize: 18,
    },
    top_title: {
        color: colors.PRIMARY_COLOR,
        margin: 20,
        fontWeight: 'bold',
        fontSize: 24,
    },
    sub_title: {
        marginLeft: 8,
        color: colors.TRANSPARENCY.BLACK.medium
    },
    inputText: {
        flex: 9
    },
    action: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: colors.TRANSPARENCY.BLACK.small,
        padding: 14,
        borderRadius: 8,
        marginVertical: 6,
    },
});