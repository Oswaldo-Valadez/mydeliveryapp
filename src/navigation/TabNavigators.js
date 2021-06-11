import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import RequesterActiveRequests from '../screens/RequesterActiveRequests';
import RequesterInactiveRequests from '../screens/RequesterInactiveRequests';
import RequesterMakeRequest from '../screens/RequesterMakeRequest';

import ProviderActiveRequests from '../screens/ProviderActiveRequests';
import ProviderInactiveRequests from '../screens/ProviderInactiveRequests';
import ProviderPendingRequests from '../screens/ProviderPendingRequests';

import * as Icon from '@expo/vector-icons';
import { colors } from '../common/theme';

import I18n from '../common/lang/config';

const RootProviderTab = createMaterialTopTabNavigator();
export const ProviderTab = () => (
    <RootProviderTab.Navigator
        initialRouteName="ProviderPendingRequestsScreen"
        tabBarPosition="bottom"
        tabBarOptions={{
            labelStyle: { fontSize: 8, color: colors.WHITE.default },
            style: { backgroundColor: colors.PRIMARY_COLOR },
            showIcon: true,
            indicatorStyle: {
                width: 0,
            }
        }}
    >
        <RootProviderTab.Screen
            name="ProviderActiveRequestsScreen"
            component={ProviderActiveRequests}
            options={{
                tabBarLabel: I18n.t('active_requests'),
                tabBarIcon: () => (
                    <Icon.MaterialIcons name="playlist-play" color={colors.WHITE.default} size={26} />
                )
            }}
        />
        <RootProviderTab.Screen
            name="ProviderPendingRequestsScreen"
            component={ProviderPendingRequests}
            options={{
                tabBarLabel: I18n.t('pending_requests'),
                tabBarIcon: () => (
                    <Icon.MaterialIcons name="playlist-play" color={colors.WHITE.default} size={26} />
                )
            }}
        />
        <RootProviderTab.Screen
            name="ProviderInactiveRequestsScreen"
            component={ProviderInactiveRequests}
            options={{
                tabBarLabel: I18n.t('inactive_requests'),
                tabBarIcon: () => (
                    <Icon.MaterialIcons name="playlist-add-check" color={colors.WHITE.default} size={26} />
                )
            }}
        />
    </RootProviderTab.Navigator>
);

const RootRequesterTab = createMaterialTopTabNavigator();
export const RequesterTab = () => (
    <RootRequesterTab.Navigator
        initialRouteName="RequesterMakeRequestScreen"
        tabBarPosition="bottom"
        tabBarOptions={{
            labelStyle: { fontSize: 8, color: colors.WHITE.default },
            style: { backgroundColor: colors.PRIMARY_COLOR },
            showIcon: true,
            indicatorStyle: {
                width: 0,
            }
        }}
    >
        <RootRequesterTab.Screen
            name="RequesterActiveRequestsScreen"
            component={RequesterActiveRequests}
            options={{
                tabBarLabel: I18n.t('active_requests'),
                tabBarIcon: () => (
                    <Icon.MaterialIcons name="playlist-play" color={colors.WHITE.default} size={26} />
                )
            }}
        />
        <RootRequesterTab.Screen
            name="RequesterMakeRequestScreen"
            component={RequesterMakeRequest}
            options={{
                tabBarLabel: I18n.t('make_request'),
                tabBarIcon: () => (
                    <Icon.Octicons name="diff-added" color={colors.WHITE.default} size={26} />
                )
            }}
        />
        <RootRequesterTab.Screen
            name="RequesterInactiveRequestsScreen"
            component={RequesterInactiveRequests}
            options={{
                tabBarLabel: I18n.t('inactive_requests'),
                tabBarIcon: () => (
                    <Icon.MaterialIcons name="playlist-add-check" color={colors.WHITE.default} size={26} />
                )
            }}
        />
    </RootRequesterTab.Navigator>
);