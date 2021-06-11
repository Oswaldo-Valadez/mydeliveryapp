import React, { useEffect, useContext } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import RequesterSearchPlace from '../screens/SearchPlace';
import RequesterSelectRoutes from '../screens/SelectRoutes';

import ProviderMakePayment from '../screens/ProviderMakePayment';

import RequestFullDetails from '../screens/RequestFullDetails';
import UserDetails from '../screens/UserDetails';

import AuthLogin from '../screens/AuthLogin';
import AuthRegister from '../screens/AuthRegister';
import SelectService from '../screens/SelectService';
import IntroSlider from '../screens/IntroSlider';

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
            <RootAuthStack.Screen name="IntroSliderScreen" component={IntroSlider} />
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
                headerTintColor: colors.WHITE.default,
                headerTitleStyle: {
                    fontFamily: 'Pacifico-Regular',
                    fontSize: 24
                }
            }}
        >
            <RootProviderStack.Screen
                options={{
                    title: I18n.t('requests'),
                    headerRight: () => (
                        <MaterialCommunityIcons.Button name="menu" backgroundColor="transparent" size={28} onPress={() => navigation.toggleDrawer()} ></MaterialCommunityIcons.Button>
                    ),
                }}
                name="RootTabScreen" component={ProviderTab}
            />
            <RootProviderStack.Screen options={{
                title: I18n.t('user_details'),
                headerRight: () => (
                    <MaterialCommunityIcons.Button name="menu" backgroundColor="transparent" size={28} onPress={() => navigation.toggleDrawer()} ></MaterialCommunityIcons.Button>
                ),
                headerLeft: (props) => (
                    props.disabled
                ),
            }}
                name="UserDetailsScreen" component={UserDetails}
            />
            <RootProviderStack.Screen options={{ title: I18n.t('subscribe') }} name="ProviderMakePaymentScreen" component={ProviderMakePayment} />
            <RootProviderStack.Screen options={{ title: I18n.t('view_full_details') }} name="RequestFullDetailsScreen" component={RequestFullDetails} />
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
                headerTintColor: colors.WHITE.default,
                headerTitleStyle: {
                    fontFamily: 'Pacifico-Regular',
                    fontSize: 24
                },
            }}
        >
            <RootRequesterStack.Screen
                options={{
                    title: I18n.t('requests'),
                    headerRight: () => (
                        <MaterialCommunityIcons.Button name="menu" backgroundColor="transparent" size={28} onPress={() => navigation.toggleDrawer()} ></MaterialCommunityIcons.Button>
                    )
                }}
                name="RootTabScreen" component={RequesterTab}
            />
            <RootRequesterStack.Screen options={{
                title: I18n.t('user_details'),
                headerRight: () => (
                    <MaterialCommunityIcons.Button name="menu" backgroundColor="transparent" size={28} onPress={() => navigation.toggleDrawer()} ></MaterialCommunityIcons.Button>
                ),
                headerLeft: (props) => (
                    props.disabled
                ),
            }}
                name="UserDetailsScreen" component={UserDetails}
            />
            <RootRequesterStack.Screen options={{ title: I18n.t('search_location') }} name="RequesterSearchPlaceScreen" component={RequesterSearchPlace} />
            <RootRequesterStack.Screen options={{ title: I18n.t('select_points') }} name="RequesterSelectRoutesScreen" component={RequesterSelectRoutes} />
            <RootRequesterStack.Screen options={{ title: I18n.t('view_full_details') }} name="RequestFullDetailsScreen" component={RequestFullDetails} />
        </RootRequesterStack.Navigator>
    );
}