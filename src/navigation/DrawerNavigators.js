import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
} from 'react-native';

import {
    createDrawerNavigator,
} from '@react-navigation/drawer';

import {
    RequesterStack,
    ProviderStack
} from './StackNavigators';

import { colors } from '../common/theme';
import I18n from '../common/lang/config';

import * as firebase from 'firebase';

import * as Icon from '@expo/vector-icons';

function DrawerContent(props) {

    useEffect(() => {
        const user = firebase.database().ref('users/' + firebase.auth().currentUser.uid);

        user.once('value', data => {
            if (data.val()) {
                const user_data = data.val();

                setUser({
                    username: user_data.username,
                    full_name: user_data.full_name,
                })
            }
        });

    }, []);

    const [user, setUser] = useState({
        username: '',
        full_name: '',
    });

    return (
        <View style={styles.drawerContainer}>
            <View style={[styles.header, { backgroundColor: colors.PRIMARY_COLOR }]}>
                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <Icon.FontAwesome name="user-circle" size={56} color={colors.WHITE.default} />
                    <Text style={{ color: colors.TRANSPARENCY.WHITE.large, fontWeight: 'bold', marginTop: 8 }}>
                        @{user.username}
                    </Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Text style={{ color: colors.WHITE.default, fontWeight: 'bold' }}>
                        {user.full_name}
                    </Text>
                </View>
            </View>
            <View style={styles.body}>
                <View style={styles.item}>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => props.navigation.navigate('UserDetailsScreen')}>
                        <Icon.MaterialCommunityIcons style={styles.itemIcon} name="account-card-details-outline" color={colors.PRIMARY_COLOR} size={24} />
                        <Text style={styles.itemText}>{I18n.t('user_details')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.item}>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => props.navigation.navigate('RootTabScreen')}>
                        <Icon.MaterialIcons style={styles.itemIcon} name="menu" color={colors.PRIMARY_COLOR} size={24} />
                        <Text style={styles.itemText}>{I18n.t('requests')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={() => firebase.auth().signOut()}>
                    <Icon.MaterialIcons style={styles.itemIcon} name="exit-to-app" color={colors.PRIMARY_COLOR} size={24} />
                    <Text style={styles.itemText}>{I18n.t('sign_out')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const RootRequesterDrawer = createDrawerNavigator();
export class RequesterDrawer extends React.Component {
    render() {
        return (
            <RootRequesterDrawer.Navigator headerMode='none' drawerContent={props => <DrawerContent {...props} />}>
                <RootRequesterDrawer.Screen name="RequesterStack" component={RequesterStack} />
            </RootRequesterDrawer.Navigator>
        );
    }
}

const RootProviderDrawer = createDrawerNavigator();
export class ProviderDrawer extends React.Component {
    render() {
        return (
            <RootProviderDrawer.Navigator style={{ backgroundColor: colors.WHITE.default }} headerMode='none' drawerContent={props => <DrawerContent {...props} />}>
                <RootProviderDrawer.Screen name="ProviderStack" component={ProviderStack} />
            </RootProviderDrawer.Navigator>
        );
    }
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        backgroundColor: colors.WHITE.default,
    },
    header: {
        flex: 2,
        borderTopWidth: 0.5,
        borderColor: colors.TRANSPARENCY.BLACK.small,
    },
    body: {
        flex: 6,
        paddingTop: 24,
    },
    footer: {
        height: 70,
        borderTopWidth: 1,
        borderColor: colors.TRANSPARENCY.BLACK.small,
    },
    itemText: {
        flex: 3,
        fontSize: 16,
        textAlignVertical: 'center',
        marginRight: 32,
    },
    itemIcon: {
        flex: 1,
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    item: {
        marginVertical: 16,
    }
});