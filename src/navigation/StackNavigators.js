import React, { useEffect, useContext } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import RequesterUserDetails from '../screens/RequesterUserDetails';
import ProviderUserDetails from '../screens/ProviderUserDetails';

import AuthLogin from '../screens/AuthLogin';
import AuthRegister from '../screens/AuthRegister';
import SelectService from '../screens/SelectService';

import { ProviderTab, RequesterTab } from './TabNavigators';

import { colors } from '../common/theme';
import Icon, { MaterialCommunityIcons } from '@expo/vector-icons';
import I18n from '../common/lang/config';

//Stack for Authentication end
const RootAuthStack = createStackNavigator();
export function AuthStack() {
    return (
        <RootAuthStack.Navigator initialRouteName="SelectServiceScreen" headerMode='none'>
            <RootAuthStack.Screen name="SelectServiceScreen" component={SelectService} />
            <RootAuthStack.Screen name="LoginScreen" component={AuthLogin} />
            <RootAuthStack.Screen name="RegisterScreen" component={AuthRegister} />
        </RootAuthStack.Navigator>
    );
}

//Stack for Privider end
const RootProviderStack = createStackNavigator();
export function ProviderStack({ navigation }) {

    return (
        <RootProviderStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.PRIMARY_COLOR,
                },
                headerTintColor: colors.WHITE,
                headerTitleStyle: {
                    fontWeight: "bold"
                }
            }}
        >
            <RootProviderStack.Screen
                options={{
                    title: I18n.t('requests'),
                    headerRight: () => (
                        <MaterialCommunityIcons.Button name="menu" backgroundColor="transparent" size={28} onPress={() => navigation.toggleDrawer()} ></MaterialCommunityIcons.Button>
                    )
                }}
                name="RootProviderTab" component={ProviderTab}
            />
            <RootProviderStack.Screen options={{ title: 'User Details' }} name="ProviderUserDetailsScreen" component={ProviderUserDetails} />
        </RootProviderStack.Navigator>
    );
}

//Stack for Requester end
const RootRequesterStack = createStackNavigator();
export function RequesterStack({ navigation }) {

    return (
        <RootRequesterStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.PRIMARY_COLOR,
                },
                headerTintColor: colors.WHITE,
                headerTitleStyle: {
                    fontWeight: "bold"
                }
            }}
        >
            <RootRequesterStack.Screen
                options={{
                    title: I18n.t('requests'),
                    headerRight: () => (
                        <MaterialCommunityIcons.Button name="menu" backgroundColor="transparent" size={28} onPress={() => navigation.toggleDrawer()} ></MaterialCommunityIcons.Button>
                    )
                }}
                name="RootRequesterTabScreen" component={RequesterTab}
            />
            <RootRequesterStack.Screen options={{ title: 'User Details' }} name="RequesterUserDetailsScreen" component={RequesterUserDetails} />
        </RootRequesterStack.Navigator>
    );
}